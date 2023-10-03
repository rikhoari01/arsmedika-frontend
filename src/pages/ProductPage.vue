<template>
  <q-page>
    <div class="q-pa-md">
      <q-btn
        color="primary"
        icon="add"
        label="Add New Product"
        @click="toggleModal"
      />
    </div>
    <div class="q-pa-md">
      <q-table
        title="Product List"
        :rows="rows"
        :columns="columns"
        row-key="index"
        class="q-pa-md"
      >
        <template v-slot:body-cell-actions="data">
          <q-td :props="data">
            <q-btn
              square
              color="red"
              icon="delete"
              @click="toggleConfirm(data.value)"
            />
          </q-td>
        </template>
      </q-table>
      <q-card v-if="isLoading" class="q-pa-md text-center">Loading ...</q-card>
    </div>

    <q-dialog v-model="isShow">
      <q-card style="width: 70%">
        <q-card-section>
          <div class="text-h6">Add New Product</div>
        </q-card-section>

        <q-separator />

        <q-card-section class="scroll">
          <q-form class="q-gutter-md full">
            <q-input
              filled
              v-model.trim="form.code"
              label="Product Code"
              lazy-rules
              :rules="[
                (val) => (val && val.length > 0) || 'Please type something',
              ]"
            />
            <q-input
              filled
              v-model.trim="form.item"
              label="Product Item"
              lazy-rules
              :rules="[
                (val) => (val && val.length > 0) || 'Please type something',
              ]"
            />
            <q-select
              filled
              v-model.trim="form.product_per"
              label="Product Per"
              :options="product_opt"
              lazy-rules
              :rules="[
                (val) =>
                  (val !== null && val !== '') ||
                  'Please select customer gender',
              ]"
            />
            <q-input
              filled
              v-model.trim="form.maximum_used"
              label="Maximum Use (Opsional)"
            />

            <p>Product Value</p>
            <div class="row q-gutter-sm">
              <div class="col">
                <q-input
                  filled
                  v-model.trim="form.value[0].value"
                  label="PM-100"
                />
              </div>
              <div class="col">
                <q-input
                  filled
                  v-model.trim="form.value[1].value"
                  label="PM-200"
                />
              </div>
              <div class="col">
                <q-input
                  filled
                  v-model.trim="form.value[2].value"
                  label="PM-400"
                />
              </div>
              <div class="col">
                <q-input
                  filled
                  v-model.trim="form.value[3].value"
                  label="PM-800"
                />
              </div>
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

    <q-dialog v-model="isConfirm" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="delete" color="red" text-color="white" />
          <span class="q-ml-sm">Are you sure want to delete product data?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn
            flat
            label="Yes"
            color="primary"
            @click="deleteProduct(dataId)"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { defineComponent, ref, reactive } from "vue";
import { productStore } from "src/stores/product";

const columns = [
  {
    name: "product-id",
    required: true,
    label: "Product Code",
    align: "center",
    field: (row) => row.code,
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: "product-item",
    align: "left",
    label: "Product Item",
    field: "item",
    sortable: true,
  },
  {
    name: "class-1",
    label: "PM-100",
    align: "center",
    field: "product_value",
    format: (val) => productClass(val, "PM-100"),
  },
  {
    name: "class-2",
    label: "PM-200",
    align: "center",
    field: "product_value",
    format: (val) => productClass(val, "PM-200"),
  },
  {
    name: "class-3",
    label: "PM-400",
    align: "center",
    field: "product_value",
    format: (val) => productClass(val, "PM-400"),
  },
  {
    name: "class-4",
    label: "PM-800",
    align: "center",
    field: "product_value",
    format: (val) => productClass(val, "PM-800"),
  },
  {
    name: "information",
    label: "Information",
    align: "left",
    field: "product_per",
    format: (val) => `Per-${val}`,
  },
  {
    name: "max_use",
    label: "Maximum Use",
    align: "left",
    field: "maximum_used",
    format: (val) => (val != null ? `${val} Day` : "-"),
  },
  { name: "actions", label: "Actions", align: "center", field: "id" },
];

const currency = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
});

const productClass = (data, product_class) => {
  const index = data.findIndex((x) => x.product.product_name === product_class);

  if (index >= 0) {
    const result = currency.format(data[index].value);
    return result;
  }

  return "-";
};

const product_opt = ["day", "year", "used"];

export default defineComponent({
  name: "ProudctPage",

  setup() {
    const product = productStore();
    const rows = ref([]);
    const isLoading = ref(true);
    const isShow = ref(false);
    const isConfirm = ref(false);
    const dataId = ref(0);

    const form = reactive({
      code: "",
      item: "",
      product_per: "",
      maximum_used: "",
      value: [
        {
          product_id: 1,
          value: "",
        },
        {
          product_id: 2,
          value: "",
        },
        {
          product_id: 3,
          value: "",
        },
        {
          product_id: 4,
          value: "",
        },
      ],
    });

    const getProducts = () => {
      rows.value = [];
      product
        .getProducts()
        .then((result) => {
          if (result.status === 200) {
            const data = result.data.result;

            data.map((data) => rows.value.push(data));
          }
          isLoading.value = false;
        })
        .catch((err) => console.log(err));
    };

    const toggleModal = () => {
      isShow.value = !isShow.value;
      onReset();
    };

    const toggleConfirm = (id) => {
      isConfirm.value = !isConfirm.value;
      dataId.value = id;
    };

    const onSubmit = () => {
      product
        .storeProduct(form)
        .then((result) => {
          if (result.status === 200) {
            isShow.value = false;
            getProducts();
          }
        })
        .catch((err) => console.log(err));
    };

    const onReset = () => {
      form.code = "";
      form.item = "";
      form.product_per = "";
      form.maximum_used = "";
      form.value = [
        {
          product_id: 1,
          value: "",
        },
        {
          product_id: 2,
          value: "",
        },
        {
          product_id: 3,
          value: "",
        },
        {
          product_id: 4,
          value: "",
        },
      ];
    };

    const deleteProduct = (id) => {
      product
        .deleteProduct(id)
        .then((result) => {
          console.log(result);
          isConfirm.value = false;
          getProducts();
        })
        .catch((err) => console.log(err));
    };

    return {
      columns,
      rows,
      isLoading,
      getProducts,
      isShow,
      isConfirm,
      dataId,
      toggleModal,
      toggleConfirm,
      product_opt,
      form,
      onSubmit,
      onReset,
      deleteProduct,
    };
  },
  mounted() {
    this.getProducts();
  },
});
</script>
