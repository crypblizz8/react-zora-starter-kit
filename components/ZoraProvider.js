import { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { providers } from 'ethers';
import Web3Modal from 'web3modal';

const ZoraContext = createContext();

export const useZora = () => useContext(ZoraContext);

export function ZoraProvider({ children }) {
  const [zora, setZora] = useState();
  const [web3Modal, setWeb3Modal] = useState();
  const [address, setAddress] = useState();

  const authenticate = useCallback(async () => {
    if (web3Modal) {
      const { Zora } = await import('@zoralabs/zdk');
      const web3Provider = await web3Modal.connect();
      await web3Provider.enable();
      const provider = new providers.Web3Provider(web3Provider);
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      setAddress(address.toLocaleLowerCase()); // Note: Not sure  why does zora lowercase addresses?
      setZora(new Zora(signer, 4));
    }
  }, [web3Modal]);

  useEffect(() => {
    (async () => {
      setWeb3Modal(
        new Web3Modal({
          network: 'rinkenby',
          cacheProvider: true,
          providerOptions: {
            walletconnect: {
              package: await import('@walletconnect/web3-provider'),
            },
          },
        })
      );
    })();
  }, []);

  return <ZoraContext.Provider value={{ zora, address, authenticate }} children={children} />;
}