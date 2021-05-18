import Web3 from 'web3';

interface ExecuteContractArgs {
    data: string;
    to: string;
    nonce?: number;
    value?: string;
    gasLimit: number;
    gasMultiplier: number;
}

export default class TradeBotUtils {
    web3: Web3;
    privateKey: string;
    publicAddress: string;

    constructor(web3: Web3, privateKey: string) {
        this.web3 = web3;
        this.privateKey = privateKey;

        const { address } = web3.eth.accounts.privateKeyToAccount(privateKey);

        this.publicAddress = address;
    }

    async getNonce(): Promise<number> {
        const nonce = await this.web3.eth.getTransactionCount(this.publicAddress);

        return nonce;
    }

    getGasPrice(): Promise<string> {
        return this.web3.eth.getGasPrice();
    }

    async executeContract({
        data,
        to,
        nonce,
        value = '0',
        gasLimit,
        gasMultiplier = 1,
    }: ExecuteContractArgs): Promise<string> {
        const theNonce = nonce || (await this.getNonce());

        const gasPrice = await this.getGasPrice();

        const txParams = {
            nonce: theNonce,
            gasPrice: Number(gasPrice) * gasMultiplier,
            gasLimit, // Need to calculate the gas
            to,
            data,
            value: this.web3.utils.toHex(value),
        };

        const { signTransaction } = this.web3.eth.accounts.privateKeyToAccount(this.privateKey);

        const { rawTransaction } = await signTransaction(txParams);

        const res = await this.web3.eth.sendSignedTransaction(rawTransaction as string);

        const { transactionHash } = res;

        console.log('Transaction Complete - transaction id - ' + transactionHash);

        return transactionHash;
    }
}
