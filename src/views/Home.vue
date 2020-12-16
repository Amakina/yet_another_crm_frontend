<template>
  <div class="home">
    <div class="first-line">YET ANOTHER</div>
    <div class="second-line">CRM</div>
  </div>
</template>

<style scoped>
.home {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation: goUp 2s linear;
}
.first-line {
  font-size: 35px;
  font-weight: bold;
  animation: appear 2s linear;
}
.second-line {
  background: #007bff;
  color: white;
  font-weight: bold;
  border-radius: 20px;
  padding: 20px;
  font-size: 150px;
  animation: appear 2s linear;
}
@keyframes goUp {
  0% {
    top: 60%
  }
  100% {
    top: 50%;
  }
}
@keyframes appear {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>