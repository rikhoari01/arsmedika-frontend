<template>
  <q-page>
    <div class="q-pa-md">
      <q-btn
        color="primary"
        icon="add"
        label="Add New Customer"
        @click="toggleModal"
      />
    </div>
    <div class="q-pa-md">
      <q-table
        title="Costumer List"
        :rows="rows"
        :columns="columns"
        row-key="customer_no"
        class="q-pa-md"
      >
        <template v-slot:body-cell-actions="data">
          <q-td :props="data">
            <q-btn
              square
              style="margin-right: 5px"
              color="primary"
              icon="visibility"
              @click="viewCustomer(data.value)"
            />
            <q-btn
              square
              style="margin-right: 5px"
              color="amber"
              icon="edit"
              @click="editCustomer(data.value)"
            />
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
  </q-page>

  <q-dialog v-model="isShow">
    <q-card>
      <q-card-section>
        <div class="text-h6">{{ modal.title }}</div>
      </q-card-section>

      <q-separator />

      <q-card-section class="scroll">
        <q-form
          @submit="onSubmit(modal.id, modal.type)"
          @reset="onReset"
          class="q-gutter-md"
          style="width: 500px"
        >
          <q-input
            filled
            v-model.trim="form.name"
            label="Customer Name"
            lazy-rules
            :rules="[
              (val) => (val && val.length > 0) || 'Please type something',
            ]"
          />

          <q-input
            filled
            label="Customer Age"
            v-model.trim="form.age"
            lazy-rules
            :rules="[
              (val) =>
                (val !== null && val !== '') || 'Please type customer age',
              (val) =>
                (reg.test(val) && val.length <= 2) || 'Please type a real age',
            ]"
          />

          <q-select
            filled
            label="Customer Gender"
            v-model.trim="form.gender"
            :options="gender_opt"
            lazy-rules
            :rules="[
              (val) =>
                (val !== null && val !== '') || 'Please select customer gender',
            ]"
          />

          <q-select
            filled
            label="Product Class"
            v-model.trim="form.product_id"
            :options="class_opt"
            lazy-rules
            :rules="[
              (val) =>
                (val !== null && val !== '') || 'Please select product class',
            ]"
          />

          <div>
            <q-btn :label="modal.btn" type="submit" color="primary" />
            <q-btn
              v-if="modal.type === 'add'"
              label="Reset"
              type="reset"
              color="primary"
              flat
              class="q-ml-sm"
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
        <span class="q-ml-sm">Are you sure want to delete customer data?</span>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Cancel" color="primary" v-close-popup />
        <q-btn
          flat
          label="Yes"
          color="primary"
          @click="deleteCustomer(modal.id)"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { defineComponent, ref, reactive } from "vue";
import { customerStore } from "src/stores/customer";
import { useRouter } from "vue-router";

const columns = [
  {
    name: "cust_id",
    align: "center",
    label: "Customer Id",
    field: "customer_no",
    sortable: true,
  },
  {
    name: "name",
    required: true,
    label: "Customer Name",
    align: "left",
    field: (row) => row.name,
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: "class",
    align: "center",
    label: "Class",
    field: (row) => row.product.product_name,
    sortable: true,
  },
  { name: "gender", align: "center", label: "Gender", field: "gender" },
  { name: "age", align: "center", label: "Age", field: "age" },
  {
    name: "premi",
    align: "right",
    label: "Premium",
    field: "premi",
    format: (val) => currency.format(val),
  },
  { name: "actions", label: "Actions", align: "center", field: "id" },
];

const currency = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
});

export default defineComponent({
  name: "CustomerPage",

  setup() {
    const customer = customerStore();
    const router = useRouter();

    const form = reactive({
      name: null,
      age: null,
      gender: null,
      product_id: null,
    });

    const modal = ref({
      title: "Add New Customer",
      btn: "Submit",
      type: "add",
      id: 0,
    });
    const isShow = ref(false);
    const isConfirm = ref(false);
    const rows = ref([]);
    const isLoading = ref(true);

    const gender_opt = [
      { label: "Female", value: "P" },
      { label: "Male", value: "L" },
    ];
    const class_opt = [
      { label: "PM-100", value: 1 },
      { label: "PM-200", value: 2 },
      { label: "PM-400", value: 3 },
      { label: "PM-800", value: 4 },
    ];

    const reg = new RegExp("^[0-9]*$");

    const onSubmit = (id, type) => {
      if (type === "add") {
        customer
          .storeCustomer({
            product_id: form.product_id.value,
            name: form.name,
            age: form.age,
            gender: form.gender.value,
          })
          .then((result) => {
            if (result.status === 200) {
              isShow.value = false;
              getCustomers();
            }
          })
          .catch((err) => console.log(err));
      }

      if (type === "edit") {
        customer
          .updateCustomer(id, {
            product_id: form.product_id.value,
            name: form.name,
            age: form.age,
            gender: form.gender.value,
          })
          .then((result) => {
            if (result.status === 200) {
              isShow.value = false;
              getCustomers();
            }
          })
          .catch((err) => console.log(err));
      }
    };

    const onReset = () => {
      form.name = null;
      form.age = null;
      form.gender = null;
      form.product_id = null;
    };

    const toggleModal = () => {
      modal.value.title = "Add New Customer";
      modal.value.btn = "Submit";
      modal.value.type = "add";
      modal.value.id = 0;
      isShow.value = !isShow.value;
      onReset();
    };

    const toggleConfirm = (id) => {
      isConfirm.value = !isConfirm.value;
      modal.value.id = id;
    };

    const getCustomers = () => {
      rows.value = [];
      customer
        .getCustomers()
        .then((result) => {
          if (result.status === 200) {
            const data = result.data.result;

            data.map((data) => rows.value.push(data));
          }
          isLoading.value = false;
        })
        .catch((err) => console.log(err));
    };

    const viewCustomer = (id) => {
      router.push({ name: "Customer Detail", query: { id: id } });
    };

    const editCustomer = (id) => {
      modal.value.title = "Edit Customer Data";
      modal.value.btn = "Update";
      modal.value.type = "edit";
      modal.value.id = id;

      customer
        .getCustomerById(id)
        .then((result) => {
          if (result.status === 200) {
            const data = result.data.result;

            isShow.value = !isShow.value;
            form.name = data.name;
            form.age = data.age;
            form.gender = {
              label: gender_opt.find((x) => x.value === data.gender).label,
              value: data.gender,
            };
            form.product_id = {
              label: class_opt.find((x) => x.value === data.product_id).label,
              value: data.product_id,
            };
          }
        })
        .catch((err) => console.log(err));
    };

    const deleteCustomer = (id) => {
      customer
        .deleteCustomer(id)
        .then((result) => {
          console.log(result);
          isConfirm.value = false;
          getCustomers();
        })
        .catch((err) => console.log(err));
    };

    return {
      columns,
      rows,
      reg,
      form,
      gender_opt,
      class_opt,
      onSubmit,
      onReset,
      isShow,
      isConfirm,
      toggleModal,
      toggleConfirm,
      getCustomers,
      isLoading,
      viewCustomer,
      editCustomer,
      deleteCustomer,
      modal,
    };
  },
  mounted() {
    this.getCustomers();
  },
});
</script>
