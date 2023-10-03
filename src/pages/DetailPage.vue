<template>
  <q-page>
    <div class="q-pa-md">
      <q-btn color="primary" icon="arrow_back" label="Back" @click="backBtn" />
    </div>
    <div class="q-pa-md">
      <q-card v-if="isLoading" class="q-pa-md text-center">Loading ...</q-card>
      <q-card v-if="!isLoading && isCustomer" class="q-pa-md">
        <div class="q-pa-md">
          <div class="row q-pa-sm">
            <div class="col-3">Customer Id</div>
            <div class="col-1">:</div>
            <div class="col-8">{{ detailData.customer_id }}</div>
          </div>
          <div class="row q-pa-sm">
            <div class="col-3">Customer Name</div>
            <div class="col-1">:</div>
            <div class="col-8">{{ detailData.customer_name }}</div>
          </div>
          <div class="row q-pa-sm">
            <div class="col-3">Customer Gender</div>
            <div class="col-1">:</div>
            <div class="col-8">{{ detailData.customer_gender }}</div>
          </div>
          <div class="row q-pa-sm">
            <div class="col-3">Customer Age</div>
            <div class="col-1">:</div>
            <div class="col-8">{{ detailData.customer_age }} year</div>
          </div>
          <div class="row q-pa-sm">
            <div class="col-3">Product Class</div>
            <div class="col-1">:</div>
            <div class="col-8">{{ detailData.customer_class }}</div>
          </div>
          <div class="row q-pa-sm">
            <div class="col-3">Premium</div>
            <div class="col-1">:</div>
            <div class="col-8">{{ detailData.customer_premium }}</div>
          </div>
        </div>
      </q-card>
      <q-card v-if="!isLoading && isHistory" class="q-pa-md">
        <div class="q-pa-md">
          <div class="row q-pa-sm">
            <div class="col-3">Claims Date</div>
            <div class="col-1">:</div>
            <div class="col-8">{{ detailData.claims_date }}</div>
          </div>
          <div class="row q-pa-sm">
            <div class="col-3">Claims by</div>
            <div class="col-1">:</div>
            <div class="col-8">
              {{ detailData.claims_name }} ({{ detailData.claims_id }})
            </div>
          </div>
          <div class="row q-pa-sm">
            <div class="col-3">Customer Class</div>
            <div class="col-1">:</div>
            <div class="col-8">
              {{ detailData.claims_class }}
            </div>
          </div>
          <div class="row q-pa-sm">
            <div class="col-3">Total Covered</div>
            <div class="col-1">:</div>
            <div class="col-8">{{ detailData.total_covered }}</div>
          </div>
          <div class="row q-pa-sm">
            <div class="col-3">Total Customer Payment</div>
            <div class="col-1">:</div>
            <div class="col-8">{{ detailData.total_cust_pay }}</div>
          </div>
        </div>
      </q-card>
    </div>
    <div class="q-pa-md q-mt md" v-if="isCustomer">
      <q-table
        title="Customer Claims History"
        :rows="rows"
        :columns="columns"
        row-key="index"
        class="q-pa-md"
      >
        <template v-slot:body-cell-details="data">
          <q-td :props="data">
            <q-btn
              square
              color="primary"
              icon="visibility"
              @click="viewDetails(data.value)"
            />
          </q-td>
        </template>
      </q-table>
      <q-card v-if="isLoading" class="q-pa-md text-center">Loading ...</q-card>
    </div>
    <div class="q-pa-md q-mt md" v-if="isHistory">
      <q-table
        title="Claims Details"
        :rows="rowDetails"
        :columns="columnDetails"
        row-key="index"
        class="q-pa-md"
      />
      <q-card v-if="isLoading" class="q-pa-md text-center">Loading ...</q-card>
    </div>
    <div class="q-pa-md flex justify-center" v-if="isHistory">
      <q-btn
        color="primary"
        icon="download"
        label="Download Receipt"
        @click="downloadReceipt(dataId)"
      />
    </div>
  </q-page>
</template>

<script>
import { defineComponent, ref } from "vue";
import { useRouter } from "vue-router";
import { customerStore } from "src/stores/customer";
import { historyStore } from "src/stores/history";

const columns = [
  {
    name: "claim-date",
    required: true,
    label: "Claim Date",
    align: "left",
    field: (row) => row.created_at,
    format: (val) => new Date(val).toLocaleDateString(),
    sortable: true,
  },
  {
    name: "total-claim",
    label: "Total Claim",
    align: "center",
    field: "total_covered",
    format: (val) => currency.format(val),
  },
  {
    name: "total-cust-pay",
    label: "Total Customer Payment",
    align: "center",
    field: "total_customer_pay",
    format: (val) => currency.format(val),
  },
  { name: "details", label: "Details", align: "center", field: "id" },
];

const columnDetails = [
  {
    name: "product-detail",
    required: true,
    label: "Product Item",
    align: "left",
    field: (row) => row.product_detail,
    format: (val) => `${val.item}`,
  },
  {
    name: "claims-price",
    label: "Price",
    align: "center",
    field: "payment_amount",
    format: (val) => currency.format(val),
  },
  {
    name: "claims-qty",
    label: "Qty",
    align: "center",
    field: "quantity",
    format: (val) => (val ? val : "-"),
  },
  {
    name: "claims-total-price",
    label: "Total Price",
    align: "center",
    field: "total_payment",
    format: (val) => currency.format(val),
  },
  {
    name: "claims-cover",
    label: "Claims Covered",
    align: "center",
    field: "covered",
    format: (val) => currency.format(val),
  },
  {
    name: "cust-pay",
    label: "Customer Payment",
    align: "center",
    field: "customer_pay",
    format: (val) => currency.format(val),
  },
];

const currency = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
});

export default defineComponent({
  name: "DetailPage",
  setup() {
    const router = useRouter();
    const customer = customerStore();
    const history = historyStore();

    const isLoading = ref(true);
    const isCustomer = ref(false);
    const isHistory = ref(false);
    const detailData = ref({});
    const rows = ref([]);
    const rowDetails = ref([]);
    const dataId = ref(0);

    const backBtn = () => {
      router.back();

      if (window.location.toString().includes("detail/history")) {
        isCustomer.value = true;
        isHistory.value = false;
      }
    };

    const getCustomerDetail = (id) => {
      customer
        .getCustomerById(id)
        .then((result) => {
          if (result.status === 200) {
            const data = result.data.result;

            detailData.value["customer_id"] = data.customer_no;
            detailData.value["customer_name"] = data.name;
            detailData.value["customer_gender"] = data.gender;
            detailData.value["customer_age"] = data.age;
            detailData.value["customer_class"] = data.product.product_name;
            detailData.value["customer_premium"] = currency.format(data.premi);
          }
          isLoading.value = false;
        })
        .catch((err) => console.log(err));
    };

    const getCustomerHistories = (id) => {
      rows.value = [];
      history.getHistoiresByCustomer(id).then((result) => {
        if (result.status === 200) {
          const data = result.data.result;

          data.map((data) => rows.value.push(data));
        }
        isLoading.value = false;
      });
    };

    const getDetails = (id) => {
      history.getHistoiresDetail(id).then((result) => {
        if (result.status === 200) {
          const data = result.data.result;

          detailData.value["claims_date"] = new Date(
            data.created_at
          ).toLocaleString();
          detailData.value["claims_name"] = data.customer.name;
          detailData.value["claims_id"] = data.customer.customer_no;
          detailData.value["claims_class"] = data.customer.product.product_name;
          detailData.value["total_covered"] = currency.format(
            data.total_covered
          );
          detailData.value["total_cust_pay"] = currency.format(
            data.total_customer_pay
          );

          rowDetails.value = [];
          const detail = data.transaction_detail;
          detail.map((data) => rowDetails.value.push(data));
        }
        isLoading.value = false;
        isCustomer.value = false;
        isHistory.value = true;
      });
    };

    const viewDetails = (id) => {
      router.push({ name: "History Detail", query: { id: id } });
      getDetails(id);
    };

    const downloadReceipt = (id) => {
      history
        .getReceipt(id)
        .then((result) => console.log(result))
        .catch((err) => console.log(err));
    };

    return {
      backBtn,
      isLoading,
      isCustomer,
      isHistory,
      detailData,
      getCustomerDetail,
      getCustomerHistories,
      getDetails,
      viewDetails,
      columns,
      rows,
      columnDetails,
      rowDetails,
      downloadReceipt,
      dataId,
    };
  },
  mounted() {
    const id = this.$route.query.id;
    this.dataId = id;
    if (window.location.toString().includes("customer")) {
      this.isCustomer = true;
      this.isHistory = false;
      this.getCustomerDetail(id);
      this.getCustomerHistories(id);
    } else if (window.location.toString().includes("history")) {
      this.isCustomer = false;
      this.isHistory = true;
      this.getDetails(id);
    }
  },
});
</script>
