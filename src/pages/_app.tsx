import {AppProps} from 'next/app'
import React from 'react'
import { Header } from '../components/Header';
import { SessionProvider as NextAuthProvider } from 'next-auth/react'

import '../styles/global.scss';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <NextAuthProvider session={pageProps.session}>
    
      <Header/>
      <Component {...pageProps} />
    
    </NextAuthProvider>
  )
}
//Provider ele detém as informações se o usuário esta logado ou não
//e ele precisa ficar por volta de todas as páginas 
export default MyApp
