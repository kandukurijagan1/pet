/**
 * PawNest Delivery OTP Mailer - Google Apps Script (Code.gs)
 * 
 * INSTRUCTIONS TO DEPLOY:
 * 1. Go to https://script.google.com and click "New project".
 * 2. Delete any existing code in Code.gs, paste this entire file, and click "Save" (Ctrl+S).
 * 3. Click the blue "Deploy" button at the top right -> Choose "New deployment".
 * 4. Select type: "Web app" (click the gear icon ⚙️ next to Select type).
 * 5. Configuration:
 *    - Description: PawNest OTP Mailer
 *    - Execute as: "Me" (your Google account)
 *    - Who has access: "Anyone" (allows PawNest app to trigger OTP emails)
 * 6. Click "Deploy", grant email permissions when prompted, and copy the "Web app URL"
 *    (e.g., https://script.google.com/macros/s/AKfycb.../exec).
 * 7. Paste this URL into your PawNest Admin Dashboard under "Apps Script Mail OTP Settings"
 *    or set VITE_APPSCRIPT_URL in your .env file!
 */

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        error: "Missing request body"
      })).setMimeType(ContentService.MimeType.JSON);
    }

    var payload = JSON.parse(e.postData.contents);
    var to = (payload.to || "").trim();
    var otp = (payload.otp || "").trim();
    var petName = payload.petName || "Your Pet";
    var orderId = payload.orderId || "ORD-000000";
    var amount = payload.amount || "0";
    var buyerName = payload.buyerName || "Valued Pet Adopter";

    if (!to || !otp) {
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        error: "Missing required fields 'to' or 'otp'"
      })).setMimeType(ContentService.MimeType.JSON);
    }

    var subject = "🐾 PawNest Delivery Verification OTP: " + otp + " (" + petName + ")";
    
    var htmlTemplate = 
      '<div style="font-family: -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, Helvetica, Arial, sans-serif; max-width: 580px; margin: 0 auto; padding: 24px; border: 1px solid #fed7aa; border-radius: 18px; background-color: #fffaf5;">' +
        '<div style="text-align: center; margin-bottom: 24px;">' +
          '<div style="display: inline-block; width: 56px; height: 56px; line-height: 56px; border-radius: 16px; background: linear-gradient(135deg, #f97316, #ea580c); color: #ffffff; font-size: 28px; box-shadow: 0 4px 12px rgba(234,88,12,0.3);">' +
            '🐾' +
          '</div>' +
          '<h1 style="color: #9a3412; font-size: 22px; font-weight: 800; margin: 12px 0 4px 0;">PawNest Delivery Verification</h1>' +
          '<p style="color: #78716c; font-size: 13px; margin: 0;">Order #' + orderId + ' • Cash on Delivery Handover</p>' +
        '</div>' +

        '<div style="background-color: #ffffff; padding: 24px; border-radius: 14px; border: 1px solid #fed7aa; box-shadow: 0 2px 8px rgba(0,0,0,0.03);">' +
          '<p style="color: #292524; font-size: 15px; margin: 0 0 12px 0;">Hello <strong>' + buyerName + '</strong>,</p>' +
          '<p style="color: #44403c; font-size: 14px; line-height: 1.5; margin: 0 0 16px 0;">' +
            'Your ordered pet <strong style="color: #c2410c;">' + petName + '</strong> is arriving! Please share the secure 6-digit One-Time Password (OTP) below with your delivery provider once you physically receive your pet and hand over the Cash on Delivery amount.' +
          '</p>' +

          '<div style="text-align: center; margin: 24px 0; padding: 20px; background: #fff7ed; border: 2px dashed #f97316; border-radius: 14px;">' +
            '<div style="font-size: 11px; text-transform: uppercase; letter-spacing: 2.5px; color: #9a3412; font-weight: 800; margin-bottom: 8px;">' +
              'Your Handover Verification OTP' +
            '</div>' +
            '<div style="font-size: 40px; font-weight: 900; letter-spacing: 10px; color: #ea580c; font-family: monospace; text-shadow: 0 1px 2px rgba(0,0,0,0.05);">' +
              otp +
            '</div>' +
            '<div style="font-size: 12px; color: #78716c; margin-top: 6px;">' +
              'Amount to Collect: <strong style="color: #166534;">$' + amount + ' (Cash on Delivery)</strong>' +
            '</div>' +
          '</div>' +

          '<div style="background: #fefce8; border: 1px solid #fef08a; padding: 12px 16px; border-radius: 10px; margin-bottom: 8px;">' +
            '<p style="color: #854d0e; font-size: 13px; line-height: 1.4; margin: 0;">' +
              '🔒 <strong>Handover Security Protocol:</strong> Do not share this OTP over phone or chat. Provide it strictly in person to the delivery customer at your doorstep after inspecting ' + petName + '.' +
            '</p>' +
          '</div>' +
        '</div>' +

        '<div style="text-align: center; margin-top: 20px; color: #a8a29e; font-size: 12px;">' +
          '<p style="margin: 0;">Sent automatically by PawNest Multi-Role Platform via Google Apps Script</p>' +
          '<p style="margin: 4px 0 0 0;">Need support? Contact admin at kandukurijagan99@gmail.com</p>' +
        '</div>' +
      '</div>';

    // Send the email via Gmail / Google Apps Script MailApp
    MailApp.sendEmail({
      to: to,
      subject: subject,
      htmlBody: htmlTemplate,
      name: "PawNest Pet Delivery"
    });

    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: "Delivery OTP email sent successfully to " + to,
      otp: otp,
      recipient: to,
      orderId: orderId,
      timestamp: new Date().toISOString()
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// Health check endpoint for testing the Web App URL
function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    status: "active",
    service: "PawNest Delivery OTP Mailer",
    version: "1.0.0",
    message: "Google Apps Script Web App is deployed and ready to send OTP emails via doPost.",
    timestamp: new Date().toISOString()
  })).setMimeType(ContentService.MimeType.JSON);
}

// Helper function to test sending inside the Apps Script editor
function testSendOtp() {
  var testEmail = Session.getActiveUser().getEmail() || "kandukurijagan99@gmail.com";
  // Generate a fresh dynamic 6-digit random OTP
  var dynamicOtp = Math.floor(100000 + Math.random() * 900000).toString();
  var fakeEvent = {
    postData: {
      contents: JSON.stringify({
        to: testEmail,
        otp: dynamicOtp,
        petName: "Bella (Golden Retriever)",
        orderId: "ORD-TEST-" + Math.floor(1000 + Math.random() * 9000),
        amount: "450",
        buyerName: "Jagan (Test)"
      })
    }
  };
  var result = doPost(fakeEvent);
  Logger.log(result.getContent());
}
