import { createPublicClient, http, parseEther, formatEther } from "viem"
import { mainnet, polygon, sepolia, polygonMumbai } from "viem/chains"

// Environment variables
const alchemyApiKey = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY!
const alchemyPolygonKey = process.env.NEXT_PUBLIC_ALCHEMY_POLYGON_API_KEY || alchemyApiKey

if (!alchemyApiKey) {
  throw new Error("Missing NEXT_PUBLIC_ALCHEMY_API_KEY environment variable")
}

// Chain configurations
export const chains = {
  ethereum: {
    mainnet: mainnet,
    testnet: sepolia,
  },
  polygon: {
    mainnet: polygon,
    testnet: polygonMumbai,
  },
}

// Public clients for reading blockchain data
export const publicClients = {
  ethereum: createPublicClient({
    chain: process.env.NODE_ENV === "production" ? mainnet : sepolia,
    transport: http(
      `https://eth-${process.env.NODE_ENV === "production" ? "mainnet" : "sepolia"}.g.alchemy.com/v2/${alchemyApiKey}`,
    ),
  }),
  polygon: createPublicClient({
    chain: process.env.NODE_ENV === "production" ? polygon : polygonMumbai,
    transport: http(
      `https://polygon-${process.env.NODE_ENV === "production" ? "mainnet" : "mumbai"}.g.alchemy.com/v2/${alchemyPolygonKey}`,
    ),
  }),
}

// Smart contract addresses (will be updated after deployment)
export const contracts = {
  subscriptionManager: {
    ethereum: "0x..." as `0x${string}`,
    polygon: "0x..." as `0x${string}`,
  },
  nftAccessPass: {
    ethereum: "0x..." as `0x${string}`,
    polygon: "0x..." as `0x${string}`,
  },
  paymentProcessor: {
    ethereum: "0x..." as `0x${string}`,
    polygon: "0x..." as `0x${string}`,
  },
}

// Contract ABIs
export const subscriptionABI = [
  {
    name: "subscribe",
    type: "function",
    inputs: [
      { name: "planId", type: "uint256" },
      { name: "duration", type: "uint256" },
    ],
    outputs: [],
    stateMutability: "payable",
  },
  {
    name: "isActive",
    type: "function",
    inputs: [{ name: "subscriber", type: "address" }],
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "view",
  },
  {
    name: "getSubscription",
    type: "function",
    inputs: [{ name: "subscriber", type: "address" }],
    outputs: [
      { name: "planId", type: "uint256" },
      { name: "startTime", type: "uint256" },
      { name: "endTime", type: "uint256" },
      { name: "isActive", type: "bool" },
    ],
    stateMutability: "view",
  },
  {
    name: "SubscriptionCreated",
    type: "event",
    inputs: [
      { name: "subscriber", type: "address", indexed: true },
      { name: "planId", type: "uint256", indexed: true },
      { name: "amount", type: "uint256" },
      { name: "duration", type: "uint256" },
    ],
  },
] as const

export const nftABI = [
  {
    name: "mint",
    type: "function",
    inputs: [
      { name: "to", type: "address" },
      { name: "tokenId", type: "uint256" },
      { name: "uri", type: "string" },
    ],
    outputs: [],
    stateMutability: "payable",
  },
  {
    name: "balanceOf",
    type: "function",
    inputs: [{ name: "owner", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
  {
    name: "tokenURI",
    type: "function",
    inputs: [{ name: "tokenId", type: "uint256" }],
    outputs: [{ name: "", type: "string" }],
    stateMutability: "view",
  },
  {
    name: "Transfer",
    type: "event",
    inputs: [
      { name: "from", type: "address", indexed: true },
      { name: "to", type: "address", indexed: true },
      { name: "tokenId", type: "uint256", indexed: true },
    ],
  },
] as const

// Utility functions
export const web3Utils = {
  // Format currency amounts
  formatEth: (wei: bigint) => formatEther(wei),
  parseEth: (eth: string) => parseEther(eth),

  // Get token balance
  async getTokenBalance(
    address: `0x${string}`,
    tokenContract: `0x${string}`,
    chain: "ethereum" | "polygon" = "ethereum",
  ) {
    const client = publicClients[chain]

    try {
      const balance = await client.readContract({
        address: tokenContract,
        abi: [
          {
            name: "balanceOf",
            type: "function",
            inputs: [{ name: "account", type: "address" }],
            outputs: [{ name: "", type: "uint256" }],
            stateMutability: "view",
          },
        ],
        functionName: "balanceOf",
        args: [address],
      })

      return balance
    } catch (error) {
      console.error("Error getting token balance:", error)
      return BigInt(0)
    }
  },

  // Check if address has active subscription
  async hasActiveSubscription(address: `0x${string}`, chain: "ethereum" | "polygon" = "ethereum") {
    const client = publicClients[chain]
    const contractAddress = contracts.subscriptionManager[chain]

    if (contractAddress === "0x...") {
      console.warn("Subscription contract not deployed yet")
      return false
    }

    try {
      const isActive = await client.readContract({
        address: contractAddress,
        abi: subscriptionABI,
        functionName: "isActive",
        args: [address],
      })

      return isActive
    } catch (error) {
      console.error("Error checking subscription:", error)
      return false
    }
  },

  // Get subscription details
  async getSubscriptionDetails(address: `0x${string}`, chain: "ethereum" | "polygon" = "ethereum") {
    const client = publicClients[chain]
    const contractAddress = contracts.subscriptionManager[chain]

    if (contractAddress === "0x...") {
      console.warn("Subscription contract not deployed yet")
      return null
    }

    try {
      const subscription = await client.readContract({
        address: contractAddress,
        abi: subscriptionABI,
        functionName: "getSubscription",
        args: [address],
      })

      return {
        planId: subscription[0],
        startTime: subscription[1],
        endTime: subscription[2],
        isActive: subscription[3],
      }
    } catch (error) {
      console.error("Error getting subscription details:", error)
      return null
    }
  },

  // Get NFT balance
  async getNFTBalance(address: `0x${string}`, chain: "ethereum" | "polygon" = "ethereum") {
    const client = publicClients[chain]
    const contractAddress = contracts.nftAccessPass[chain]

    if (contractAddress === "0x...") {
      console.warn("NFT contract not deployed yet")
      return BigInt(0)
    }

    try {
      const balance = await client.readContract({
        address: contractAddress,
        abi: nftABI,
        functionName: "balanceOf",
        args: [address],
      })

      return balance
    } catch (error) {
      console.error("Error getting NFT balance:", error)
      return BigInt(0)
    }
  },

  // Validate Ethereum address
  isValidAddress: (address: string): address is `0x${string}` => {
    return /^0x[a-fA-F0-9]{40}$/.test(address)
  },

  // Get current gas price
  async getGasPrice(chain: "ethereum" | "polygon" = "ethereum") {
    const client = publicClients[chain]

    try {
      const gasPrice = await client.getGasPrice()
      return gasPrice
    } catch (error) {
      console.error("Error getting gas price:", error)
      return BigInt(0)
    }
  },

  // Estimate transaction gas
  async estimateGas(transaction: any, chain: "ethereum" | "polygon" = "ethereum") {
    const client = publicClients[chain]

    try {
      const gas = await client.estimateGas(transaction)
      return gas
    } catch (error) {
      console.error("Error estimating gas:", error)
      return BigInt(21000) // Default gas limit
    }
  },
}

// WalletConnect configuration
export const walletConnectConfig = {
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
  chains: [
    process.env.NODE_ENV === "production" ? mainnet : sepolia,
    process.env.NODE_ENV === "production" ? polygon : polygonMumbai,
  ],
  metadata: {
    name: "GoBill.AI",
    description: "Next-generation OTT billing and monetization platform",
    url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    icons: ["https://your-domain.com/icon.png"],
  },
}

// Export types for TypeScript
export type Chain = "ethereum" | "polygon"
export type ContractName = "subscriptionManager" | "nftAccessPass" | "paymentProcessor"
