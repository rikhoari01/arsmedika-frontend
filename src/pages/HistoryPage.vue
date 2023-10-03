<template>
  <q-page>
    <div class="q-pa-md">
      <q-btn
        color="primary"
        icon="add"
        label="New Claim"
        @click="toggleModal"
      />
    </div>
    <div class="q-pa-md">
      <q-table
        title="Claims History"
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
              @click="viewHistory(data.value)"
            />
          </q-td>
        </template>
      </q-table>
      <q-card v-if="isLoading" class="q-pa-md text-center">Loading ...</q-card>
    </div>
  </q-page>

  <q-dialog v-model="isShow">
    <q-card style="width: 70%">
      <q-card-section>
        <div class="text-h6">Add New Claim</div>
      </q-card-section>

      <q-separator />

      <q-card-section class="scroll">
        <q-form class="q-gutter-md full">
          <q-input
            filled
            label="Customer Id"
            v-model.trim="form.customer_no"
            lazy-rules
            :rules="[
              (val) => (val && val.length > 0) || 'Please type something',
            ]"
          />

          <p>Claimed Product</p>
          <div
            class="q-gutter-xs row"
            v-for="(input, counter) in form.product_payment"
            v-bind:key="counter"
          >
            <q-select
              filled
              label="Product Code"
              style="width: calc(100% / 4 + 30px)"
              :options="productCode"
              v-model.trim="input.product_code"
            />
            <q-input
              filled
              label="Price"
              style="width: calc(100% / 4 + 10px)"
              v-model.trim="input.payment"
              prefix="Rp"
            />
            <q-input
              filled
              label="Quantity"
              style="width: calc(100% / 4 + 10px)"
              v-model.trim="input.duration"
              type="number"
            />

            <div class="flex items-center justify-center">
              <q-btn
                icon="delete"
                color="red"
                @click="removeProductClaims(counter)"
                :disabled="form.product_payment.length === 1"
              />
            </div>
          </div>

          <div class="flex justify-center">
            <q-btn
              icon="add"
              label="Add Product"
              color="secondary"
              @click="addProductClaims"
            />
          </div>

          <div class="q-mt-xl">
            <q-btn
              label="Create"
              type="submit"
              color="primary"
              @click="onSubmit"
            />
            <q-btn
              label="Reset"
              type="reset"
              color="primary"
              flat
              class="q-ml-sm"
              @click="onReset"
            />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { defineComponent, ref, reactive } from "vue";
import { historyStore } from "src/stores/history";
import { productStore } from "src/stores/product";
import { transactionStore } from "src/stores/transaction";
import { useRouter } from "vue-router";

const columns = [
  {
    name: "claim-date",
    required: true,
    label: "Claim Date",
    align: "left",
    field: (row) => row.created_at,
    format: (val) => new Date(val).toLocaleString(),
    sortable: true,
  },
  {
    name: "customer-name",
    label: "Customer Name",
    align: "left",
    field: "customer",
    format: (val) => `${val.name}`,
    sortable: true,
  },
  {
    name: "total-covered",
    label: "Total Covered",
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

const currency = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
});

export default defineComponent({
  name: "HistoryPage",

  setup() {
    const router = useRouter();
    const history = historyStore();
    const product = productStore();
    const transaction = transactionStore();

    const rows = ref([]);
    const isLoading = ref(true);
    const isShow = ref(false);
    const productCode = ref([]);

    const form = reactive({
      customer_no: "",
      product_payment: [
        {
          product_code: "",
          payment: "",
          duration: "",
        },
      ],
    });

    const getHistories = () => {
      rows.value = [];
      history
        .getHistories()
        .then((result) => {
          if (result.status === 200) {
            const data = result.data.result;

            data.map((data) => rows.value.push(data));
          }
          isLoading.value = false;
        })
        .catch((err) => console.log(err));
    };

    const viewHistory = (id) => {
      router.push({ name: "History Detail", query: { id: id } });
    };

    const toggleModal = () => {
      isShow.value = !isShow.value;
      onReset();
    };

    const getProductCode = () => {
      product
        .getProductCode()
        .then((result) => {
          if (result.status === 200) {
            const data = result.data.result;

            data.map((data) => {
              productCode.value.push(data.code);
            });
          }
        })
        .catch((err) => console.log(err));
    };

    const addProductClaims = () => {
      form.product_payment.push({
        product_code: "",
        payment: "",
        duration: "",
      });
    };

    const removeProductClaims = (counter) => {
      form.product_payment.splice(counter, 1);
    };

    const onReset = () => {
      form.customer_no = "";
      form.product_payment = [
        {
          product_code: "",
          payment: "",
          duration: "",
        },
      ];
    };

    const onSubmit = () => {
      transaction
        .postTransaction(form)
        .then((result) => {
          console.log(result);
          if (result.status === 200) {
            isShow.value = false;
            getHistories();
          }
        })
        .catch((err) => console.log(err));
    };

    return {
      columns,
      rows,
      isLoading,
      getHistories,
      viewHistory,
      isShow,
      toggleModal,
      getProductCode,
      productCode,
      form,
      addProductClaims,
      removeProductClaims,
      onReset,
      onSubmit,
    };
  },
  mounted() {
    this.getHistories();
    this.getProductCode();
  },
});
</script>
