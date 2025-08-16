"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Wallet, Loader2, CheckCircle, AlertCircle } from "lucide-react"
import { apiCall } from "@/hooks/use-api"

interface NFTMintDialogProps {
  nftPass: {
    id: number
    name: string
    price: number
    currency: string
    contractAddress?: string
    benefits: string[]
  }
  onMintSuccess?: (result: any) => void
}

export function NFTMintDialog({ nftPass, onMintSuccess }: NFTMintDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinting, setIsMinting] = useState(false)
  const [mintResult, setMintResult] = useState<any>(null)
  const [walletAddress, setWalletAddress] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("")

  const handleMint = async () => {
    if (!walletAddress || !paymentMethod) return

    setIsMinting(true)
    try {
      const result = await apiCall("/nft", {
        method: "POST",
        body: JSON.stringify({
          action: "mint_nft",
          data: {
            nftId: nftPass.id,
            walletAddress,
            paymentMethod,
            contractAddress: nftPass.contractAddress,
            price: nftPass.price,
            currency: nftPass.currency,
          },
        }),
      })

      setMintResult(result)
      onMintSuccess?.(result)
    } catch (error) {
      setMintResult({
        success: false,
        message: error instanceof Error ? error.message : "Minting failed",
      })
    } finally {
      setIsMinting(false)
    }
  }

  const resetDialog = () => {
    setMintResult(null)
    setWalletAddress("")
    setPaymentMethod("")
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full bg-purple-600 hover:bg-purple-700">
          <Wallet className="h-4 w-4 mr-2" />
          Mint Access Pass
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Mint {nftPass.name}</DialogTitle>
          <DialogDescription>Mint your NFT access pass to unlock premium features</DialogDescription>
        </DialogHeader>

        {!mintResult ? (
          <div className="space-y-4">
            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold">{nftPass.name}</span>
                <Badge variant="secondary">
                  {nftPass.price} {nftPass.currency}
                </Badge>
              </div>
              <div className="text-sm text-gray-600">
                <p className="mb-2">Benefits included:</p>
                <ul className="space-y-1">
                  {nftPass.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-green-500" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <Label htmlFor="wallet">Wallet Address</Label>
                <Input
                  id="wallet"
                  placeholder="0x..."
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="payment">Payment Method</Label>
                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="metamask">MetaMask</SelectItem>
                    <SelectItem value="walletconnect">WalletConnect</SelectItem>
                    <SelectItem value="coinbase">Coinbase Wallet</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={resetDialog} className="flex-1 bg-transparent">
                Cancel
              </Button>
              <Button
                onClick={handleMint}
                disabled={!walletAddress || !paymentMethod || isMinting}
                className="flex-1 bg-purple-600 hover:bg-purple-700"
              >
                {isMinting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Minting...
                  </>
                ) : (
                  <>
                    <Wallet className="h-4 w-4 mr-2" />
                    Mint NFT
                  </>
                )}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {mintResult.success ? (
              <div className="text-center p-6">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-green-900 mb-2">Minting Successful!</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Your NFT access pass is being minted. You'll receive it shortly.
                </p>
                {mintResult.transactionHash && (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Transaction Hash:</p>
                    <p className="text-xs font-mono break-all">{mintResult.transactionHash}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center p-6">
                <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-red-900 mb-2">Minting Failed</h3>
                <p className="text-sm text-gray-600">
                  {mintResult.message || "Something went wrong. Please try again."}
                </p>
              </div>
            )}

            <Button onClick={resetDialog} className="w-full">
              Close
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
