<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { Ref, ComputedRef } from 'vue'
import Web3 from 'web3'
import axios from 'axios'

let web3: Web3
const isMetaMaskInstalled: Ref<boolean> = ref(false)
const account: Ref<string> = ref('')
const chainId: Ref<number> = ref(0)
const balance: Ref<string> = ref('')
const chains: Ref<any[]> = ref([])

const networkSymbol: ComputedRef<any> = computed(
  () => chains.value.find((chain) => chain.chainId === chainId.value)?.nativeCurrency?.symbol ?? 'unknown symbol'
)

onMounted(() => {
  isMetaMaskInstalled.value = typeof (window as any).ethereum !== 'undefined'

  if (isMetaMaskInstalled.value) {
    ;(window as any).ethereum.on('chainChanged', connectWallet)
    ;(window as any).ethereum.on('accountsChanged', connectWallet)
    web3 = new Web3((window as any).ethereum)

    fetchChains()
  }
})

async function connectWallet() {
  try {
    account.value = (await web3.eth.requestAccounts())[0] || ''
    chainId.value = await web3.eth.getChainId()
    balance.value = web3.utils.fromWei(await web3.eth.getBalance(account.value), 'ether')
  } catch (error) {
    console.log(error)
  }
}

async function fetchChains() {
  try {
    const { data } = await axios.get('https://chainid.network/chains.json')
    chains.value = data
  } catch (error) {
    console.log(error)
  }
}
</script>

<template>
  <button v-if="isMetaMaskInstalled" class="btn" @click="connectWallet">Connect MetaMask</button>
  <h1 v-else>Install MetaMask extension please.</h1>
  <div class="banner" v-if="chainId">
    <strong>Chain ID: </strong><span>{{ chainId }}</span>
  </div>
  <div class="banner" v-if="account">
    <strong>Account: </strong><span>{{ account }}</span>
  </div>
  <div class="banner" v-if="balance">
    <strong>Balance: </strong><span>{{ balance }} {{ networkSymbol }}</span>
  </div>
</template>

<style scoped>
.btn {
  cursor: pointer;
  border: none;
  color: #fff;
  background-color: #037dd6;
  padding: 15px 32px;
  text-align: center;
  font-size: 16px;
}
.banner {
  margin: 10px 0;
  padding: 20px;
  border-radius: 6px;
  color: #fff;
  background-color: #79b473;
}
</style>
