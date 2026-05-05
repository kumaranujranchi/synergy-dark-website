/**
 * Synergy Brand Architect - Convex Integration
 * Handles form submissions and dynamic content fetching
 */

async function submitLead(formData) {
    const response = await fetch(`${CONVEX_URL}/api/run/leads/addLead`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            args: {
                name: formData.get("full_name") || "",
                email: formData.get("form_email") || "",
                phone: formData.get("phone") || "",
                subject: formData.get("subject") || "",
                message: formData.get("message") || "",
            },
            format: "json"
        }),
    });
    const result = await response.json();
    return result.value || result;
}

async function subscribeNewsletter(email) {
    const response = await fetch(`${CONVEX_URL}/api/run/subscribers/addSubscriber`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            args: { email },
            format: "json"
        }),
    });
    const result = await response.json();
    return result.value || result;
}

// Global initialization
$(document).ready(function() {
    // Contact Form Handler
    $("#contact_form").on("submit", async function(e) {
        e.preventDefault();
        const $form = $(this);
        const $btn = $form.find("button[type='submit']");
        const $btnTitle = $btn.find(".btn-title");
        const originalText = $btnTitle.text();
        
        // Basic validation
        const email = $form.find("input[name='form_email']").val();
        if (!email) {
            alert("Please enter your email.");
            return;
        }

        $btnTitle.text("Sending...");
        $btn.prop("disabled", true);
        
        try {
            const formData = new FormData(this);
            const result = await submitLead(formData);
            
            if (result.error) {
                alert("Error: " + result.error);
            } else {
                alert("Thank you! Your message has been sent successfully.");
                $form[0].reset();
            }
        } catch (error) {
            console.error("Submission error:", error);
            alert("An error occurred. Please check if your backend is running.");
        } finally {
            $btnTitle.text(originalText);
            $btn.prop("disabled", false);
        }
    });

    // Newsletter Form Handler (if exists)
    $("#subscribe-form").on("submit", async function(e) {
        e.preventDefault();
        const email = $(this).find("input[type='email']").val();
        if (!email) return;

        try {
            const result = await subscribeNewsletter(email);
            if (result.error) {
                alert("Subscription failed: " + result.error);
            } else {
                alert("Thank you for subscribing!");
                $(this)[0].reset();
            }
        } catch (error) {
            console.error("Newsletter error:", error);
        }
    });
});
