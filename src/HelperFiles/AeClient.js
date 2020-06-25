import {Aepp} from '@aeternity/aepp-sdk';
import Config from '../Config/Config';

async function getReverseWindow() {
  const iframe = document.createElement('iframe')
  iframe.src = 'https://base.aepps.com/browser/aechat.aekiti.com'
  iframe.style.display = 'none'
  document.body.appendChild(iframe)
  await new Promise(resolve => {
    const handler = ({ data }) => {
      if (data.method !== 'ready') return
      window.removeEventListener('message', handler)
      resolve()
    }
    window.addEventListener('message', handler)
  })
  return iframe.contentWindow
}


const getClient=async()=> {
  try {
    let client = await Aepp({
      parent: this.runningInFrame ? window.parent : await getReverseWindow()
    });
    let contractInstance = await client.getContractInstance(Config.contractSource, { contractAddress: Config.contractAddress });
    return  contractInstance;
  } catch (err) {
    console.error(err);
  }
}

export default getClient;
