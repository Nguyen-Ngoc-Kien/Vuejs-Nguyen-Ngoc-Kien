<script setup>
import { ref, watch, computed, onMounted } from 'vue';

const showModal = ref(false);
const isEditing = ref(false);
const taskName = ref('');
const taskType = ref('');
const startTime = ref('');
const endTime = ref('');
const confirmDelete = ref(false);
const todoList = ref([]); 
const editingIndex = ref(null);
const selectedFilter = ref('All'); 

const filteredTasks = computed(() => {
  if (selectedFilter.value === 'All') return todoList.value;
  return todoList.value.filter(task => task.status === selectedFilter.value);
});

const setFilter = (filter) => {
  selectedFilter.value = filter;
};

const getCurrentTime = () => {
  const now = new Date();
  const currentHours = String(now.getHours()).padStart(2, '0');
  const currentMinutes = String(now.getMinutes()).padStart(2, '0');
  return `${currentHours}:${currentMinutes}`;
};

onMounted(() => {
  const savedTasks = localStorage.getItem('todoList');
  if (savedTasks) {
    todoList.value = JSON.parse(savedTasks);
  }
});

watch(todoList, (newList) => {
  localStorage.setItem('todoList', JSON.stringify(newList));
}, { deep: true });

const submitTask = () => {
  const currentTime = getCurrentTime();

  if (startTime.value < currentTime) {
    alert('Lỗi: Thời gian bắt đầu không được trước thời gian hiện tại.');
    return;
  }

  // Validate end time
  if (endTime.value <= startTime.value) {
    alert('Lỗi nhập thời gian, yêu cầu nhập lại');
    return;
  }

  const task = {
    name: taskName.value,
    type: taskType.value,
    start: startTime.value,
    end: endTime.value,
    status: 'Open', 
  };

  if (isEditing.value) {
    todoList.value[editingIndex.value] = task;
  } else {
    todoList.value.push(task);
  }

  resetForm();
};

const resetForm = () => {
  showModal.value = false;
  taskName.value = '';
  taskType.value = '';
  startTime.value = '';
  endTime.value = '';
  isEditing.value = false;
  editingIndex.value = null;
};

const editTask = (index) => {
  const task = todoList.value[index];
  taskName.value = task.name;
  taskType.value = task.type;
  startTime.value = task.start;
  endTime.value = task.end;
  editingIndex.value = index;
  isEditing.value = true;
  showModal.value = true;
};

const deleteTask = (index) => {
  todoList.value[index].status = 'Deleted'; 
  confirmDelete.value = false;
};

const updateTaskStatus = (index) => {
  const task = todoList.value[index];
  const now = new Date();
  const taskEnd = new Date(`1970-01-01T${task.end}`);

  if (now > taskEnd) {
    task.status = 'Closed';
  } else {
    if (task.status !== 'Deleted') {
      task.status = task.status === 'Closed' ? 'Open' : 'Closed';
    }
  }
};

watch(todoList, (newList) => {
  newList.forEach((task, index) => {
    const now = getCurrentTime();
    if (task.status === 'Open' && now >= task.end) {
      task.status = 'Closed'; // Automatically close overdue tasks
    }
  });
});

const isOverdue = (task) => {
  const now = getCurrentTime();
  return task.status === 'Open' && now >= task.end && task.status !== 'Deleted'; 
};
</script>

<template>
  <div class="container w-[500px] mx-auto my-16 bg-white rounded-lg px-10 min-h-[800px] pb-[35px]">
    <header class="w-full py-5">
      <ul class="flex justify-between w-full px-5">
        <li role="button" class=" text-lg">Messages</li>
        <li role="button" class=" text-lg font-bold border-b-2 border-grey">Today's Task</li>
        <li role="button" class=" text-lg">Last Activity</li>
      </ul>
    </header>

    <div class="container-content bg-slate-100 px-5 pb-[10px]">
      <div class="flex justify-between py-7">
        <div class="title-and-time">
          <p class=" text-2xl font-bold">Today's Task</p>
          <p>Wednesday, 11 May</p>
        </div>
        <button 
          class="flex items-center rounded-xl h-10 p-3.5 gap-[0.56rem] bg-blue-100" 
          @click="showModal = true; isEditing = false">
          <p class="text-blue-600">+</p>
          <p class="text-blue-600">New Task</p>
        </button>
      </div>

      <ul class="flex justify-between">
        <li role="button" class="flex gap-3 border-r-2 w-[75px]" @click="setFilter('All')">
          <p :class="{ 'text-blue-600 font-bold': selectedFilter === 'All' }">All</p>
          <p class=" bg-blue-600 px-2 rounded-xl">{{ todoList.length }}</p>
        </li>
        <li role="button" class="flex gap-3" @click="setFilter('Open')">
          <p :class="{ 'text-blue-600 font-bold': selectedFilter === 'Open' }">Open</p>
          <p class=" bg-slate-400 px-2 rounded-xl">{{ todoList.filter(task => task.status === 'Open').length }}</p>
        </li>
        <li role="button" class="flex gap-3" @click="setFilter('Closed')">
          <p :class="{ 'text-blue-600 font-bold': selectedFilter === 'Closed' }">Closed</p>
          <p class=" bg-slate-400 px-2 rounded-xl">{{ todoList.filter(task => task.status === 'Closed').length }}</p>
        </li>
        <li role="button" class="flex gap-3" @click="setFilter('Deleted')">
          <p :class="{ 'text-blue-600 font-bold': selectedFilter === 'Deleted' }">Delete</p>
          <p class=" bg-slate-400 px-2 rounded-xl">{{ todoList.filter(task => task.status === 'Deleted').length }}</p>
        </li>
      </ul>

      <div class=" my-5 ">
        <div v-for="(task, index) in filteredTasks" :key="index" class="px-5 py-6 bg-white rounded-xl mt-[25px]">
          <div class="flex items-center justify-between ">
            <div class="text">
              <p class="text-xl font-bold" :class="{ 'line-through text-red-800': task.status === 'Deleted' }">{{ task.name }} <span v-if="isOverdue(task)" class="text-red-500">Quá hạn</span></p>

              <p class="mb-[5px]">{{ task.type }}</p>
            </div>
            <input type="checkbox" class="rounded-br-full w-[25px] h-[25px] mb-[17px]" 
                   @change="updateTaskStatus(index)" :checked="task.status === 'Closed'"  :disabled="task.status === 'Closed' || task.status === 'Deleted' || isOverdue(task)"></input>
          </div>
          <div class="border border-b-1"></div>
          <div class="flex items-center justify-between mt-5">
            <div class="flex gap-[10px] mt-[5px]">
              <p>Today:</p>
              <p>{{ task.start }} - {{ task.end }}</p>
            </div>
            <div class="flex gap-[20px]">
              <i v-if="task.status !== 'Deleted' && task.status !== 'Closed'" role="button" class="fas fa-trash cursor-pointer" @click="confirmDelete = index"></i>
              <i v-if="task.status === 'Open'" role="button" class="fas fa-wrench cursor-pointer" @click="editTask(index)"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div v-if="showModal" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div class="bg-white p-5 rounded-lg w-1/3">
      <h2 class="text-xl font-bold mb-4">{{ isEditing ? 'Edit Task' : 'Create New Task' }}</h2>
      <form @submit.prevent="submitTask">
        <div class="mb-4">
          <label for="taskName" class="block mb-2">Task Name</label>
          <input v-model="taskName" id="taskName" type="text" class="border rounded p-2 w-full" required />
        </div>
        <div class="mb-4">
          <label for="taskType" class="block mb-2">Task Type</label>
          <input v-model="taskType" id="taskType" type="text" class="border rounded p-2 w-full" required />
        </div>
        <div class="mb-4">
          <label for="startTime" class="block mb-2">Start Time</label>
          <input v-model="startTime" id="startTime" type="time" class="border rounded p-2 w-full" required />
        </div>
        <div class="mb-4">
          <label for="endTime" class="block mb-2">End Time</label>
          <input v-model="endTime" id="endTime" type="time" class="border rounded p-2 w-full" required />
        </div>
        <div class="flex justify-between">
          <button type="button" @click="resetForm" class="bg-gray-300 rounded px-4 py-2">Cancel</button>
          <button type="submit" class="bg-blue-500 text-white rounded px-4 py-2">{{ isEditing ? 'Update' : 'Submit' }}</button>
        </div>
      </form>
    </div>
  </div>

  <div v-if="confirmDelete !== false" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div class="bg-white p-5 rounded-lg w-1/3">
      <h2 class="text-xl font-bold mb-4">Confirm Delete</h2>
      <p>Are you sure you want to delete this task?</p>
      <div class="flex justify-between mt-4">
        <button type="button" @click="confirmDelete = false" class="bg-gray-300 rounded px-4 py-2">Cancel</button>
        <button type="button" @click="deleteTask(confirmDelete)" class="bg-red-500 text-white rounded px-4 py-2">Delete</button>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>