import React from 'react';
import { Button } from '../ui/button';
import { FaGoogle } from 'react-icons/fa';
import { signIn } from '@/auth';

export const GoogleSignInButton = () => {
    return (
        <form className='w-full' action={async () => {
            'use server'
            await signIn('google')
        }}>
            <Button variant="outline" className="w-full cursor-pointer">
                <FaGoogle />
                Sign in with Google
            </Button>
        </form>
    );
};
