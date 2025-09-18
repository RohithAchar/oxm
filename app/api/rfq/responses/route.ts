import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const buy_lead_id = searchParams.get("buy_lead_id");

    let query = supabase.from("buy_lead_responses").select(`
        *,
        supplier_snapshot
      `);

    if (buy_lead_id) {
      // First check if user has access to this buy lead
      const { data: buyLead, error: buyLeadError } = await supabase
        .from("buy_leads")
        .select("buyer_id, supplier_id")
        .eq("id", buy_lead_id)
        .single();

      if (buyLeadError) {
        return NextResponse.json(
          { error: "Buy lead not found" },
          { status: 404 }
        );
      }

      if (buyLead.buyer_id !== user.id && buyLead.supplier_id !== user.id) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }

      query = query.eq("buy_lead_id", buy_lead_id);
    } else {
      // If no buy_lead_id specified, get all responses for buy leads where user is either buyer or supplier
      const { data: userBuyLeads, error: buyLeadsError } = await supabase
        .from("buy_leads")
        .select("id")
        .or(`buyer_id.eq.${user.id},supplier_id.eq.${user.id}`);

      if (buyLeadsError) {
        console.error("Error fetching user buy leads:", buyLeadsError);
        return NextResponse.json(
          { error: "Failed to fetch buy leads" },
          { status: 500 }
        );
      }

      if (userBuyLeads && userBuyLeads.length > 0) {
        query = query.in(
          "buy_lead_id",
          userBuyLeads.map((lead) => lead.id)
        );
      } else {
        return NextResponse.json({ data: [] });
      }
    }

    const { data, error } = await query.order("created_at", {
      ascending: false,
    });

    if (error) {
      console.error("Error fetching buy lead responses:", error);
      return NextResponse.json(
        { error: "Failed to fetch responses" },
        { status: 500 }
      );
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      buy_lead_id,
      quoted_price,
      min_qty,
      message,
      currency = "INR",
    } = body;

    // Validate required fields
    if (!buy_lead_id) {
      return NextResponse.json(
        { error: "Buy lead ID is required" },
        { status: 400 }
      );
    }

    // First, check if the buy lead exists and user is the supplier
    const { data: buyLead, error: buyLeadError } = await supabase
      .from("buy_leads")
      .select("supplier_id, status")
      .eq("id", buy_lead_id)
      .single();

    if (buyLeadError) {
      return NextResponse.json(
        { error: "Buy lead not found" },
        { status: 404 }
      );
    }

    if (buyLead.supplier_id !== user.id) {
      return NextResponse.json(
        { error: "Only the supplier can respond to this RFQ" },
        { status: 403 }
      );
    }

    if (buyLead.status === "closed" || buyLead.status === "cancelled") {
      return NextResponse.json(
        { error: "Cannot respond to closed or cancelled RFQ" },
        { status: 400 }
      );
    }

    // Get supplier business information for snapshot
    const { data: businessData, error: businessError } = await supabase
      .from("supplier_businesses")
      .select(
        "id, business_name, type, city, state, gst_number, is_verified, business_address, phone, alternate_phone, profile_avatar_url"
      )
      .eq("profile_id", user.id)
      .single();

    if (businessError) {
      console.error("Error fetching supplier business:", businessError);
      return NextResponse.json(
        { error: "Failed to fetch supplier information" },
        { status: 500 }
      );
    }

    // Get supplier profile information
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("full_name, email, phone_number, avatar_url")
      .eq("id", user.id)
      .single();

    if (profileError) {
      console.error("Error fetching supplier profile:", profileError);
      return NextResponse.json(
        { error: "Failed to fetch supplier profile" },
        { status: 500 }
      );
    }

    // Create supplier snapshot
    const supplierSnapshot = {
      id: user.id,
      business_id: businessData.id,
      full_name: profileData.full_name,
      email: profileData.email,
      phone_number: profileData.phone_number,
      avatar_url: profileData.avatar_url || businessData.profile_avatar_url,
      business_name: businessData.business_name,
      business_type: businessData.type,
      city: businessData.city,
      state: businessData.state,
      gst_number: businessData.gst_number,
      is_verified: businessData.is_verified,
      business_address: businessData.business_address,
      phone: businessData.phone,
      alternate_phone: businessData.alternate_phone,
    };

    // Create the response
    const { data, error } = await supabase
      .from("buy_lead_responses")
      .insert({
        buy_lead_id,
        supplier_id: user.id,
        // Store quoted_price in paise
        quoted_price: quoted_price
          ? Math.round(Number(quoted_price) * 100)
          : null,
        min_qty: min_qty ? Number(min_qty) : null,
        message: message || null,
        currency,
        supplier_snapshot: supplierSnapshot,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating buy lead response:", error);
      return NextResponse.json(
        { error: "Failed to create response" },
        { status: 500 }
      );
    }

    // Update the buy lead status to "responded"
    const { error: updateError } = await supabase
      .from("buy_leads")
      .update({
        status: "responded",
        updated_at: new Date().toISOString(),
      })
      .eq("id", buy_lead_id);

    if (updateError) {
      console.error("Error updating buy lead status:", updateError);
      // Don't fail the request, just log the error
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
