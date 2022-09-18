import {FaGithub} from 'react-icons/fa'
import { FiX } from 'react-icons/fi'
import { signIn,signOut, useSession } from 'next-auth/react' 


import styles from './styles.module.scss';

export function SignInButton(){
    const {data:session} = useSession() //verificar se o usuário está logado

    
    
    return session ? (                //se o usuário estiver logado,mostra esse botão
        <button type="button"             
        className={styles.signInButton}
        onClick={ () =>signOut()}
        >
            <FaGithub  color="#04d361"/>
            {session.user.name} 
            <FiX color="#737380" className={styles.closeIcon}/>
        </button>

    ): (
        <button type="button"       //se o usuário não estiver logado,mostra esse botão
        className={styles.signInButton}
        onClick = {() => signIn ('github')} // logar o usuário 
        >
            <FaGithub  color="#eba417"/>
            Sign in with Github
        </button>

    );
    
}