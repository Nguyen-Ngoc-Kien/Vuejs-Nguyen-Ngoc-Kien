<script>
export default {
  data() {
    return {
      cart: [],
      products: [
        {
          id: 1,
          name: "PS5",
          price: 5555,
          publicDate: "05-05-2021",
          image: "https://cdn.vjshop.vn/hightech/may-choi-game/ps5/sony-ps-5-1.jpg",
          hot: true,
          addedToCart: false, // Add this property
        },
        {
          id: 2,
          name: "PS4",
          price: 4444,
          publicDate: "04-04-2021",
          image: "https://gmedia.playstation.com/is/image/SIEPDC/ps4-slim-image-block-01-en-24jul20?$native--t$",
          hot: true,
          addedToCart: false, // Add this property
        },
        {
          id: 3,
          name: "PS3",
          price: 3333,
          publicDate: "03-03-2021",
          image: "https://haloshop.vn/image/cache/catalog/products/may-game/sony-playstation/ps3-slim-2000-tang-688-games-700x700.jpg",
          hot: false,
          addedToCart: false, // Add this property
        },
      ],
      paymentMethods: [
        { text: "COD", value: 1 },
        { text: "Banking", value: 2 },
        { text: "Bitcoin", value: 3 },
      ],
      selectedPayment: 2,
    };
  },
  computed: {
    hotProducts() {
      const hotProducts = this.products.filter(product => product.hot);
      console.log('Hot Products:', hotProducts); 
      return hotProducts;
    },
  },
  methods: {
    addToCart(product) {
      this.cart.push(product);
      product.addedToCart = true; // Update button state
      // Remove the alert
    },
    notifyPaymentChange() {
      const selectedMethod = this.paymentMethods.find(method => method.value === this.selectedPayment);
      alert(`Selected payment method: ${selectedMethod.text}`);
    },
  },
};
</script>

<template>
  <div class="container max-w-3xl mx-auto p-5">
    <h1 class="text-3xl font-bold mb-5">Product List</h1>
    <ul class="grid grid-cols-1 sm:grid-cols-3 gap-6">
      <li v-for="product in products" :key="product.id" class="bg-white rounded-lg transition-transform transform shadow-md p-4 max-sm:mb-[160px] hover:scale-105">
        <img :src="product.image" alt="product.name" class="w-full h-48 object-cover rounded-md mb-4" />
        <h2 class="text-xl font-semibold">{{ product.name }}</h2>
        <p class="text-gray-600">Price: ${{ product.price }}</p>
        <p class="text-gray-500">Release Date: {{ product.publicDate }}</p>
        <p class="mt-2">
          <span v-if="product.hot" class="text-green-500 font-bold">Hot Product!</span>
          <span v-else class="text-red-500">Not Hot Product</span>
        </p>
        <button 
          @click="addToCart(product)" 
          class="mt-4 bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600 transition duration-200">
          {{ product.addedToCart ? 'Added' : 'Add to Cart' }} <!-- Use the state variable -->
        </button>
      </li>
    </ul>

    <div class="container mx-auto px-4 mt-[180px]">
      <h2 class="text-2xl font-bold mb-4">Hot Products</h2>
      <ul class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <li
          v-for="product in hotProducts"
          :key="product.id"
          class="bg-white shadow-md rounded-lg transition-transform transform hover:scale-105 max-sm:mb-[160px]"
        >
          <img
            :src="product.image"
            alt="Product image"
            class="w-full h-48 object-cover"
          />
          <h2 class="text-xl font-semibold">{{ product.name }}</h2> 
          <p class="text-gray-600">Price: ${{ product.price }}</p>
          <p class="text-gray-500">Release Date: {{ product.publicDate }}</p>
          <button 
            @click="addToCart(product)" 
            class="mt-4 bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600 transition duration-200">
            {{ product.addedToCart ? 'Added' : 'Add to Cart' }} <!-- Use the state variable -->
          </button>
        </li>
      </ul>
    </div>

    <div class="group mt-[190px]">
      <h1 class="text-3xl font-bold mt-10 mb-5">Payment Methods</h1>
      <select 
          v-model="selectedPayment" 
          @change="notifyPaymentChange" 
          class="border rounded-lg p-2 bg-white shadow-md">
          <option v-for="method in paymentMethods" :key="method.value" :value="method.value">
          {{ method.text }}
          </option>
      </select>
    </div>
  </div>
</template>
  
<style scoped>
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    overflow: hidden;
  }
</style>