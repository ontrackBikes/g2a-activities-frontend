<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="5" lg="4">
        <v-card variant="outlined" class="pa-6 text-center g2a-rounded-border">
          <!-- Loading -->
          <template v-if="loading">
            <v-progress-circular indeterminate size="48" class="mb-4" />
            <h3>Verifying Payment</h3>
            <p class="text-medium-emphasis">
              Please wait while we confirm your payment
            </p>
          </template>

          <!-- Success -->
          <template v-else-if="status === 'success'">
            <v-avatar size="74" class="mb-4" color="#E8F5E9">
              <v-icon size="54" color="success"> mdi-check-circle </v-icon>
            </v-avatar>

            <h3 class="text-success">Payment Successful</h3>

            <v-divider class="my-4" />

            <v-list density="compact">
              <v-list-item>
                <v-list-item-title>Order ID</v-list-item-title>
                <v-list-item-subtitle>{{
                  orderInfo.order_id
                }}</v-list-item-subtitle>
              </v-list-item>

              <v-list-item>
                <v-list-item-title>Payment ID</v-list-item-title>
                <v-list-item-subtitle>{{
                  orderInfo.payment_id
                }}</v-list-item-subtitle>
              </v-list-item>

              <v-list-item>
                <v-list-item-title>Amount</v-list-item-title>
                <v-list-item-subtitle>
                  ₹{{ orderInfo.amount }}
                </v-list-item-subtitle>
              </v-list-item>
            </v-list>
            <v-divider class="my-4"></v-divider>
            <!-- inside your Success template -->
            <div>
              <p>
                Our agent will get in touch with you shortly to confirm the
                booking details.
              </p>
              <!-- <v-btn
                flat
                class="mt-5"
                color="brandColor"
                rounded="lg"
                size="large"
                @click="printReceipt"
                >Print <v-icon class="ml-1">mdi-printer</v-icon></v-btn
              > -->

              <div>In case need immediate assistance</div>
              <div><a href="tel:080-45686588">080-45686588</a></div>
            </div>
          </template>

          <!-- Failed -->
          <template v-else-if="status === 'failed'">
            <v-avatar size="74" class="mb-4" color="#FBE9E7">
              <v-icon size="54" color="error"> mdi-close-circle </v-icon>
            </v-avatar>

            <h3 class="text-error">Payment Failed</h3>

            <p class="text-medium-emphasis mt-2">
              {{
                orderInfo.reason ||
                "Payment could not be completed if the amount is debited it will be refunded back to you within 5-7 working days."
              }}
            </p>

            <v-btn
              flat
              block
              color="brandColor"
              class="mt-4"
              @click="retryPayment"
            >
              Home
            </v-btn>
          </template>

          <!-- Pending -->
          <template v-else>
            <v-avatar size="74" class="mb-4" color="#FFF8E1">
              <v-icon size="54" color="brandColor"> mdi-clock-outline </v-icon>
            </v-avatar>

            <h3 class="text-brandColor">Payment Pending</h3>

            <p class="text-medium-emphasis mt-2">
              We are waiting for confirmation from the bank
            </p>

            <v-btn
              flat
              block
              color="primary"
              class="mt-4"
              @click="fetchOrderStatus"
            >
              Refresh Status
            </v-btn>
          </template>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import apiClient from "@/services/api";
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const loading = ref(true);
const status = ref("pending"); // success | failed | pending
const orderInfo = ref({});
const notesData = ref({});
const customerName = ref("");
const orderId = route.query.order_id;

const fetchOrderStatus = async () => {
  loading.value = true;

  try {
    const { data } = await apiClient.get("/razorpay/order-info", {
      params: {
        order_id: orderId,
      },
    });
    orderInfo.value = data;
    status.value = data.status || "pending";
    notesData.value = data.notes || {};
    customerName.value = notesData.value.customerName || "Customer";
  } catch (error) {
    console.error("Order status fetch failed", error);
    status.value = "failed";
  } finally {
    loading.value = false;
  }
};

const retryPayment = () => {
  //   router.push(`/checkout?order_id=${orderId}`);  later we can do this.
  router.push("/");
};

const printReceipt = () => {
  const receiptHTML = `
    <html>
      <head>
        <title>Go2Andaman Booking Receipt</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 20px; color: #333; }
          .header { text-align: center; margin-bottom: 20px; }
          .header img { max-width: 150px; }
          h1 { color: #ff8c00; margin: 10px 0 0 0; font-size: 24px; }
          p.greeting { font-size: 14px; margin: 10px 0; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { padding: 10px; border: 1px solid #ddd; }
          th { background-color: #f7f7f7; text-align: left; }
          .footer { margin-top: 30px; font-size: 12px; text-align: center; color: #555; line-height: 1.5; }
          .whatsapp-link { color: #25D366; text-decoration: none; font-weight: bold; }
        </style>
      </head>
      <body>
        
        <div class="header">
        <img src="https://ferry.go2andaman.com/uploads/web-images/andman-logo-1.svg" alt="Go2Andaman Logo" />
          <h1>Booking Receipt</h1>
        </div>
        <p class="greeting">
          Hi ${customerName.value},<br/>
          Thank you for choosing Go2Andaman for your ${notesData.value.productType}! We have successfully received your payment.
        </p>

        <table>
          <tr>
            <th>Booking ID</th><td>${notesData.value.orderId || "-"}</td>
          </tr>
          <tr>
            <th>Payment ID</th><td>${orderInfo.value.payment_id || "-"}</td>
          </tr>
          <tr>
            <th>Amount Paid</th><td>₹${orderInfo.value.amount || "-"}</td>
          </tr>
          <tr>
            <th>Location</th><td>${notesData.value.location || "-"}</td>
          </tr>
          <tr>
            <th>Pickup / Drop</th>
            <td>${notesData.value.pickupType || "-"} - ${
              notesData.value.pickup || "-"
            }<br/>
                ${notesData.value.dropType || "-"} - ${
                  notesData.value.drop || "-"
                }</td>
          </tr>
          <tr>
            <th>Pickup Hotel</th><td>${
              notesData.value.pickupHotelName || "N/A"
            }</td>
          </tr>
          <tr>
            <th>Drop Hotel</th><td>${
              notesData.value.dropHotelName || "N/A"
            }</td>
          </tr>
          <tr>
            <th>Booking Dates</th><td>${notesData.value.startDate || "-"} to ${
              notesData.value.endDate || "-"
            }</td>
          </tr>
          <tr>
            <th>Quantity</th><td>${notesData.value.quantity || "-"}</td>
          </tr>
          <tr>
            <th>Payment Type</th><td>${notesData.value.paymentType || "-"}</td>
          </tr>
        </table>

        <div class="footer">
          This ticket is sold by <strong>Webport Media Pvt Ltd</strong><br/>
          GST: 35AABCW7431P1ZU | HSN/SAC Code: 998424<br/>
          Contact Go2Andaman.com: PH 080-45686588 | WhatsApp 8045686588
        </div>
      </body>
    </html>
  `;

  const newWindow = window.open("", "_blank");
  newWindow.document.write(receiptHTML);
  newWindow.document.close();
  newWindow.focus();
  newWindow.print();
};

onMounted(() => {
  if (!orderId) {
    status.value = "failed";
    loading.value = false;
    return;
  }

  fetchOrderStatus();
});
</script>
