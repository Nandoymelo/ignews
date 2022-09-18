import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github" ///integrar o next-auth com aplicação

import {fauna} from '../../../services/faunadb';
import { Not, query as q } from "faunadb";

export default NextAuth({  
    providers: [
        GithubProvider({
        clientId: process.env.GITHUB_CLIENT_ID,
         clientSecret: process.env.GITHUB_CLIENT_SECRET,
      
        }),
    
    ],
    callbacks: {
        async signIn({ user, account, profile, credentials }) {   //inserindo no banco de dados do fauna
            const {email } = user
            try {
                await fauna.query(
                    q.If( //se nao existe usuário usuário com esse email 
                        q.Not(
                            q.Exists(
                                q.Match(
                                    q.Index('user_by_email'),
                                    q.Casefold(user.email)
                                )
                            )
                        ),
                        q.Create(            //cria um usuário             //Create é um método para fazer inserção
                            q.Collection('users'), //nome da collection que quer inserir
                            { data:{email} }
                        ),
                        q.Get(  //se existe, buscando um usuário por com esse email
                            q.Match(
                                q.Index('user_by_email'),
                                q.Casefold(user.email)
                            )
                        )
                    )
                )

                return true
            } catch{
                return false
            }
          
        },
    }
})