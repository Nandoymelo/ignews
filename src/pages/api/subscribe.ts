import { query as q } from "faunadb";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from 'next-auth/react'
import { fauna } from "../../services/faunadb";
import { stripe } from "../../services/stripe";


type User = {
    ref: {
        id: string;
    }
    data: {
         stripe_customer_id: string;
    }
}

export default async (req:NextApiRequest, res:NextApiResponse) => {
    if(req.method === 'POST'){                  //Verificando se método da requisição é post
        const session = await getSession({ req })

        const user = await fauna.query<User>( //Buscar o usuário pelo email
            q.Get(
                q.Match(
                    q.Index('user_by_email'),
                    q.Casefold(session.user.email)
                )
            )
        )

        let customerId = user.data.stripe_customer_id //Pega o customerId que já existe no banco


        if(!customerId) {  //se ele nao existir
            const stripeCustomer = await stripe. customers.create({ // cadrastando no stripe
                email:session.user.email,
            }) 


            await fauna.query(  //salva o usuário no banco
            q.Update(
                q.Ref(q.Collection('users'), user.ref.id),
                {
                    data: {
                        stripe_customer_id: stripeCustomer.id,  // => aqui vc passa os dados que quer atualizar e o dado que quer colocar
                    }
                }
            )
        )

        customerId = stripeCustomer.id  //reatribui na variável
        }


        const StripeCheckoutSession = await stripe.checkout.sessions.create({        //criando uma sessão no stripe
            customer: customerId,
            payment_method_types: ["card"],
            billing_address_collection: 'required',
            line_items: [
                {price: 'price_1Lb3wWLJdbL4IFi4NQmNmne3', quantity: 1}
            ],
            mode: 'subscription',
            allow_promotion_codes: true,
            success_url: process.env.STRIPE_SUCCESS_URL,
            cancel_url: process.env.STRIPE_CANCEL_URL

        })
        return res.status(200).json({ sessionId: StripeCheckoutSession.id})
    }else{
        res.setHeader('Allow','POST')
        res.status(405).send('Method Not Allowed')
    }
}