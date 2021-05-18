# Trade Bot Utils

This is a bunch of utility libraries for trading

## Listening to web3 block changes

```js
export function subscribeBlock(cb: (result: any) => void) {
  const web3 = new Web3(WEB3_RPC);

  const subscription = web3.eth.subscribe('newBlockHeaders').on("connected", function(subscriptionId){
    console.log(subscriptionId);
  })
  .on("data", cb)
  .on("error", (error) => {
    if (error) {
      console.error(error);

      subscription.unsubscribe();

      setTimeout(() => {
        subscribeBlock(cb);
      }, 5000); // 5 seconds delay
    }
  });
}
```