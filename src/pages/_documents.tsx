import Document, { Html, Head, Main, NextScript } from 'next/document'
import React from 'react'

export default class MyDocuments extends Document {
    render (){
        return (
            <Html>
            <Head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700;900&display=swap" rel="stylesheet"></link>
                <link rel="shortcut icon" href="/favicon.png" type="image/png" />
            
            </Head>
            <body>
                <Main/>     
                <NextScript/>
            </body>
            </Html>
        )

    }
}

// Main: todo conteúdo vai se renderizado no main
//NextScript: o next vai colocar os arquivos tsx para a aplicação funcionar