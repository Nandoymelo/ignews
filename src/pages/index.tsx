import React from "react";
import Head from 'next/head'; // todo conteúdo dentro do Head vai ser jogado para o Head do _documents
import { GetStaticProps } from  'next';

import styles from './home.module.scss';
import { SubscribeButton } from "../components/SubscribeButton";
import { stripe } from "../services/stripe";


interface HomeProps {
  product: {
    priceId: string;
    amount: number;
  }
}

export default function Home({product}: HomeProps ) { 
  return (
    <>              
    <Head>
        <title>Início | Ignews </title>
    </Head>

    <main className ={styles.contentContainer}>
      <section className ={styles.hero}>
        <span>👏 Hey,welcome</span>
        <h1>News about the <span>React</span> world</h1>
        <p>
          Get acess to all the publications <br />
          <span>for {product.amount} month</span>
        </p>

        <SubscribeButton priceId= {product.priceId}/>
      </section>

      <img src="/images/avatar.svg" alt="Girl coding" />
    </main>

    </>
  )
}
// nao se pode ter um elemento abaixo do outro sem ter um por volta EX: <></> 

export const getStaticProps: GetStaticProps = async () => {   //getServerSideProps excuta no next nao no browser
                                                              //getStaticProps salva um Html estático por tempo
  const price = await stripe.prices.retrieve('price_1Lb3wWLJdbL4IFi4NQmNmne3')
                                                                      // chamando Api do Stripe
  const  product = {
    priceId: price.id,
    amount : new Intl.NumberFormat('en-US', {
      style:'currency',
      currency: 'USD',
    }).format(price.unit_amount /100,),
  }; 

  return{
    props: {
      product,
    },
    revalidate: 60 * 60 *24, //24 hours

  }
}