from web3 import Web3
from eth_account import Account
from eth_account.signers.local import LocalAccount
from typing import Optional, Dict, Any

# This is a placeholder for actual blockchain interaction utilities.
# In a real application, you would connect to specific blockchain nodes (e.g., Ethereum, Polygon, Binance Smart Chain)
# using their RPC URLs and interact with deployed smart contracts.

class BlockchainUtils:
    def __init__(self, rpc_url: str = "http://127.0.0.1:8545"):
        """
        Initializes the Web3 connection.
        For production, use Infura, Alchemy, or a self-hosted node.
        """
        self.w3 = Web3(Web3.HTTPProvider(rpc_url))
        if not self.w3.is_connected():
            print(f"Warning: Could not connect to Ethereum node at {rpc_url}. Please ensure it's running.")
            # Fallback or raise error depending on application requirements
            self.w3 = None

    def is_connected(self) -> bool:
        """Checks if connected to the blockchain node."""
        return self.w3 is not None and self.w3.is_connected()

    def generate_wallet(self) -> Dict[str, str]:
        """Generates a new Ethereum wallet address and private key."""
        account = Account.create()
        return {
            "address": account.address,
            "private_key": account._private_key.hex()
        }

    def get_balance(self, address: str) -> Optional[float]:
        """Gets the ETH balance of an address in Ether."""
        if not self.is_connected():
            return None
        try:
            balance_wei = self.w3.eth.get_balance(address)
            return self.w3.from_wei(balance_wei, 'ether')
        except Exception as e:
            print(f"Error getting balance for {address}: {e}")
            return None

    def send_transaction(self, private_key: str, to_address: str, amount_ether: float, gas_limit: int = 21000) -> Optional[str]:
        """
        Sends ETH from one address to another.
        Returns the transaction hash.
        """
        if not self.is_connected():
            return None
        try:
            account: LocalAccount = Account.from_key(private_key)
            nonce = self.w3.eth.get_transaction_count(account.address)
            gas_price = self.w3.eth.gas_price

            transaction = {
                'from': account.address,
                'to': to_address,
                'value': self.w3.to_wei(amount_ether, 'ether'),
                'gas': gas_limit,
                'gasPrice': gas_price,
                'nonce': nonce,
            }

            signed_txn = self.w3.eth.account.sign_transaction(transaction, private_key)
            tx_hash = self.w3.eth.send_raw_transaction(signed_txn.rawTransaction)
            return tx_hash.hex()
        except Exception as e:
            print(f"Error sending transaction: {e}")
            return None

    def deploy_smart_contract(self, private_key: str, bytecode: str, abi: list, *constructor_args) -> Optional[str]:
        """
        Deploys a smart contract to the blockchain.
        Returns the contract address.
        """
        if not self.is_connected():
            return None
        try:
            account: LocalAccount = Account.from_key(private_key)
            nonce = self.w3.eth.get_transaction_count(account.address)
            gas_price = self.w3.eth.gas_price

            Contract = self.w3.eth.contract(abi=abi, bytecode=bytecode)
            construct_txn = Contract.constructor(*constructor_args).build_transaction({
                'from': account.address,
                'nonce': nonce,
                'gasPrice': gas_price
            })

            signed = self.w3.eth.account.sign_transaction(construct_txn, private_key)
            tx_hash = self.w3.eth.send_raw_transaction(signed.rawTransaction)
            tx_receipt = self.w3.eth.wait_for_transaction_receipt(tx_hash)
            return tx_receipt.contractAddress
        except Exception as e:
            print(f"Error deploying contract: {e}")
            return None

    def call_smart_contract_method(self, contract_address: str, abi: list, private_key: str,
                                   method_name: str, *method_args, value_ether: float = 0) -> Optional[Any]:
        """
        Calls a smart contract method (state-changing or view).
        For state-changing methods, returns transaction hash. For view methods, returns the result.
        """
        if not self.is_connected():
            return None
        try:
            contract = self.w3.eth.contract(address=contract_address, abi=abi)
            method = getattr(contract.functions, method_name)

            if method.abi['stateMutability'] in ['view', 'pure']:
                # This is a read-only call
                return method(*method_args).call()
            else:
                # This is a state-changing transaction
                account: LocalAccount = Account.from_key(private_key)
                nonce = self.w3.eth.get_transaction_count(account.address)
                gas_price = self.w3.eth.gas_price

                transaction = method(*method_args).build_transaction({
                    'from': account.address,
                    'nonce': nonce,
                    'gasPrice': gas_price,
                    'value': self.w3.to_wei(value_ether, 'ether')
                })

                signed_txn = self.w3.eth.account.sign_transaction(transaction, private_key)
                tx_hash = self.w3.eth.send_raw_transaction(signed_txn.rawTransaction)
                return tx_hash.hex()
        except Exception as e:
            print(f"Error calling contract method {method_name}: {e}")
            return None

# Example Usage (for testing purposes)
if __name__ == "__main__":
    # This part is for local testing and won't run in the Vercel environment directly
    # You would typically call these functions from your services.py or app.py

    # Ensure a local Ganache or similar testnet is running at http://127.0.0.1:8545
    # For real networks, replace with actual RPC URL and handle private keys securely
    blockchain_utils = BlockchainUtils()

    if blockchain_utils.is_connected():
        print("\nConnected to blockchain node.")

        # 1. Generate a new wallet
        new_wallet = blockchain_utils.generate_wallet()
        print(f"\nNew Wallet Address: {new_wallet['address']}")
        print(f"New Wallet Private Key: {new_wallet['private_key']}")

        # 2. Get balance (e.g., of a known account from your testnet)
        # Replace with an actual address that has some ETH on your testnet
        test_address = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266" # Example Ganache address
        balance = blockchain_utils.get_balance(test_address)
        if balance is not None:
            print(f"\nBalance of {test_address}: {balance} ETH")

        # 3. Send a transaction (requires a private key with funds)
        # WARNING: Do NOT use real private keys in plain code. Use environment variables or secure key management.
        # For testing, use a private key from your local testnet (e.g., Ganache)
        sender_private_key = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80" # Example Ganache private key
        recipient_address = new_wallet['address']
        amount_to_send = 0.1

        print(f"\nSending {amount_to_send} ETH from {Account.from_key(sender_private_key).address} to {recipient_address}...")
        tx_hash = blockchain_utils.send_transaction(sender_private_key, recipient_address, amount_to_send)
        if tx_hash:
            print(f"Transaction sent! Hash: {tx_hash}")
            # Wait for transaction to be mined (optional, but good for testing)
            # receipt = blockchain_utils.w3.eth.wait_for_transaction_receipt(tx_hash)
            # print(f"Transaction receipt: {receipt}")
            # print(f"Recipient balance after send: {blockchain_utils.get_balance(recipient_address)} ETH")
        else:
            print("Failed to send transaction.")

        # 4. Smart Contract Interaction (Example: ERC20 Token)
        # This requires a deployed contract. For demonstration, let's assume a simple contract.
        # Example: A very basic contract ABI and bytecode (replace with your actual contract)
        # For a real contract, compile it using solc or Hardhat/Truffle to get ABI and bytecode.
        sample_abi = [
            {
                "inputs": [],
                "stateMutability": "nonpayable",
                "type": "constructor"
            },
            {
                "inputs": [],
                "name": "getValue",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "_newValue",
                        "type": "uint256"
                    }
                ],
                "name": "setValue",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            }
        ]
        # This bytecode is for a very simple 'Storage' contract from Remix IDE for demonstration
        # It will likely not work directly without proper compilation setup.
        sample_bytecode = "0x6080604052348015610010575f80fd5b50600080546001600160a01b0319163317905561011c806100325f395f365f373d3d373d3d3d5f73600080604052600080546001600160a01b0319163317905561011c806100325f395f365f373d3d373d3d3d5f73600080604052600080546001600160a01b0319163317905561011c806100325f395f365f373d3d373d3d3d5f73600080604052600080546001600160a01b0319163317905561011c806100325f395f365f373d3d373d3d3d5f73600080604052600080546001600160a01b0319163317905561011c806100325f395f365f373d3d373d3d3d5f73600080604052600080546001600160a01b0319163317905561011c806100325f395f365f373d3d373d3d3d5f73600080604052600080546001600160a01b0319163317905561011c806100325f395f365f373d3d373d3d3d5f73600080604052600080546001600160a01b0319163317905561011c806100325f395f365f373d3d373d3d3d5f73600080604052600080546001600160a01b0319163317905561011c806100325f395f365f373d3d373d3d3d5f73600080604052600080546001600160a01b0319163317905561011c806100325f395f365f373d3d373d3d3d5f73600080604052600080546001600160a01b0319163317905561011c806100325f395f365f373d3d373d3d3d5f73600080604052600080546001600160a01b0319163317905561011c806100325f395f365f373d3d373d3d3d5f73600080604052600080546001600160a01b0319163317905561011c806100325f395f365f373d3d373d3d3d5f73600080604052600080546001600160a01b0319163317905561011c806100325f395f365f373d3d373d3d3d5f73600080604052600080546001600160a01b0319163317905561011c806100325f395f365f373d3d373d3d3d5f73600080604052600080546001600160a01b0319163317905561011c806100325f395f365f373d3d373d3d3d5f73600080604052600080546001600160a01b0319163317905561011c806100325f395f365f373d3d373d3d3d5f73600080604052600080546001600160a01b0319163317905561011c806100325f395f365f373d3d373d3d3d5f73600080604052600080546001600160a01b0319163317905561011c806100325f395f365f373d3d373d3d3d5f73600080604052600080546001600160a01b0319163317905561011c806100325f395f365f373d3d373d3d3d5f73600080604052600080546001600160a01b0319163317905561011c806100325f395f365f373d3d373d3d3d5f73600080604052600080546001600160a01b0319163317905561011c806100325f395f365f373d3d373d3d3d5f73600080604052600080546001600160a01b0319163317905561011c806100325f395f365f373d3d373d3d3d5f73600080604052600080546001600160a01b0319163317905561011c806100325f395f365f373d3d373d3d3d5f73600080604052600080546001600160a01b0319163317905561011c806100325f395f365f373d3d373d3d3d5f73600080604052600080546001600160a01b0319163317905561011c806100325f395f365f373d3d373d3d3d5f73600080604052600080546001600160a01b0319163317905561011c806100325f395f365f373d3d373d3d3d5f73600080604052600080546001600160a01b0319163317905561011c806100325f395f365f373d3d373d3d3d5f73600080604052600080546001600160a01b0319163317905561011c806100325f395f365f373d3d373d3d3d5f73600080604052600080546001600160a01b0319163317905561011c806100325f395f365f373d3d373d3d3d5f73600080604052600080546001600160a01b0319163317905561011c806100325f395f365f373d3d373d3d3d5f73600080604052600080546001600160a01b0319163317905561011c806100325f395f365f373d3d373d3d3d5f73600080604052600080546001600160a01b0319163317905561011c806100325f395f365f373d3d373d3d3d5f73600080604052600080546001600160a01b0319163317905561011c806100325f395f365f373d3d373d3d3d5f73600080604052600080546001600160a01b0319163317905561011c806100325f395f365f373d3d373d3d3d5f73600080604052600080546001600160a01b0319163317905561011c806100325f395f365f373d3d373d3d3d5f73600080604052600080546001600160a01b0319163317905561011c806100325f395f365f373d3d373d3d3d5f73600080604052600080546001600160a01b0319163317905561011c806100325f395f365f373d3d373d3d3d5f73600080604052600080546001600160a01b0319163317905561011c806100325f395f365f373d3d373d3d3d5f73600080604052600080546001600160a01b0319163317905561011c806100325f395f365f373d3d373d3d3d5f73600080604052600080546001600160a01b0319163317905561011c806100325f395f365f373d3d373d3d3d5f73600080604052600080546001600160a01b0319163317905561011c806100325f395f365f373d3d373d3d3d5f73600080604052600080546001600160a01b0319163317905561011c806100325f395f365f373d3d373d3d3d5f73600080604052600080546001600160a01b0319163317905561011c806100325f395f365f373d3d373d3d3d5f73600080604052600080546001600160a01b0319163317905561011c806100325f395f365f373d3d373d3d3d5f73600080604052600080546001600160a01b0319163317905561011c806100325f395f365f373d3d373d3d3d5f73600080604052600080546001600160a01b0319163317905561011c806100325f395f365f373d3d373d3d3d5f73600080604052600080546001600160a01b0319163317905561011c806100325f395f365f373d3d373d3d3d5f73600080604052600080546001600160a01b0319163317905561011c806100325f395f365f373d3d373d3d3d5f73600080604052600080546001600160a01b0319163317905561011c806100325f395f365f373d3d373d3d3d5f73600080604052600080546001600160a01b0319163317905561011c806100325f395f365f373d3d373d3d3d5f73600080604052600080546001600160a01b0319163317905561011c806100325f395f365f373d3d373d3d3d5f73600080604052600080546001600160a01b0319163317905561011c806100325f395f365f373d3d373d3d3d5f73600080604052600080546001600160a01b0319163317905561011c806100325f395f365f373d3d373d3d3d5f73600080604052600080546001600160a01b0319163317905561011c806100325f395f365f373d3d373d3d3d5f73600080604052600080546001600160a01b0319163317905561011c806100325f395f365f373d3d373d3d3d5f73600080604052600080546001600160a01b0319163317905561011c806100325f395f365f373d3d373d3d3d5f73600080604052600080546001600160a01b0319163317905561011c806100325f395f365f373d3d373d3d3d5f73600080604052600080546001600160a01b0319163317905561011c806100325f395f365f373d3d373d3d3d5f73600080604052600080546001600160a01b0319163317905561011c806100325f395f365f373d3d373d3d3d5f73600080604052600080546001600160a01b0319163317905561011c806100325f395f365f373d3d373d3d3d5f73600080604052600080546001600160a01b0319163317905561011c806100325f395f365f373d3d373d3d3d5f73600080604052600080546001600160a01b0319163317905561011c806100325f395f365f373d3d373d3d3d5f73600080604052600080546001600160a01b0319163317905561011c806100325f395f365f373d3d373d3d3d5f73600080604052600080546001600160a01b0319163317905561011c806100325f395f365f373d3d373d3d3d5f73600080604052600080546001600160a01b0319163317905561011c806100325f395f365f373d3d373d3d3d5f73600080604052600080546001600160a01b0319163317905561011c806100325f395f365f373d3d373d3d3d5f73600080604052600080546001600160a01b0319163317905561011c806100325f395f365f373d3d373d3d3d5f73600080604052600080546001600160a01b0319163317905561011c806100325f395f365f373d3d373d3d3d5f73600080604052600080546001600160a01b0319163317905561011c806100325f395f365f373d3d373d3d3d5f73600080604052600080546001600160a01b0319163317905561011c806100325f395f365f373d3d373d3d3d5f73600080604052600080546001600160a01b0319163317905561011c806100325f395f365f373d3d373d3d3d5f73600080604052600080546001600160a01b0319163317905561011c806100325f395f365f373d3d373d3d3d5f73600080604052600080546001600160a01b0319163317905561011c806100325f395f365f373d3d373d3d3d5f73600080604052600080546001600160a01b0319163317905561011c806100325f395f365f373d3d373d3d3d5f73600080604052600080546001600160a01b0319163317905561011c806100325f395f365f373d3d373d3d3d5f73600080604052600080546001600160a01b0319163317905561011c806100325f395f365f373d3d373d3d3d5f73600080604052600080546001600160a01b0319163317905561011c806100325f395f365f373d3d373d3d3d5f73600080604052600080546001600160a01b0319163317905561011c806100325f395f365f373d3d373d3d3d5f73600080604052600080546001600160a01b0319163317905561011c806100325f395f365f373d3d373d3d3d5f73600080604052600080546001600160a01b0319163317905561011c806100325f395f365f373d3d373d3d3d5f73600080604052600080546001600160a01b0319163317905561011c806100325f395f365f373d3d373d3d3d5f73600080604052600080546001600160a01b0319163317905561011c806100"
