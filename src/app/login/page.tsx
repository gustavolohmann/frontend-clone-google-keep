'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export default function LoginPage() {
    const [step, setStep] = useState<'email' | 'password'>('email');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const handleNext = async () => {
        if (step === 'email') {
            if (!email) {
                alert('Por favor, insira seu email.');
                return;
            }
            setStep('password');
        } else {
            try {

                const res = await fetch('http://localhost:5000/user/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, password })
                });
                const data = await res.json();
                localStorage.setItem('jwtToken', data.token);
                router.push('/');
            } catch (error) {
                console.error('Erro:', error);
                alert('Erro ao fazer login. Por favor, tente novamente.');
            }
        }
    };


    return (
        <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center py-6 px-4">
            <div className="w-full max-w-md bg-white shadow-md rounded-lg p-8 text-center">
                <img
                    src="https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_112x36dp.png"
                    alt="Google"
                    className="mx-auto mb-6"
                />

                <h1 className="text-2xl text-gray-800 mb-1">Sign in</h1>
                <p className="text-sm text-gray-600 mb-6">Use your Google Account</p>

                <div className="text-left mb-4">
                    <label className="block text-sm text-gray-700 mb-1">
                        {step === 'email' ? 'Email or phone' : 'Enter your password'}
                    </label>
                    <input
                        type={step === 'email' ? 'email' : 'password'}
                        className="w-full border border-gray-300 rounded-md text-black px-3 py-2 focus:outline-none focus:border-blue-600"
                        value={step === 'email' ? email : password}
                        onChange={(e) =>
                            step === 'email' ? setEmail(e.target.value) : setPassword(e.target.value)
                        }
                    />
                </div>

                {step === 'email' && (
                    <div className="text-left mb-6">
                        <a href="#" className="text-sm text-blue-600 hover:underline">Forgot email?</a>
                        <p className="text-xs text-gray-600 mt-3">
                            Not your device? Use Guest mode to sign in privately.{' '}
                            <a href="#" className="text-blue-600 hover:underline">Learn more</a>
                        </p>
                    </div>
                )}

                <div className="flex justify-between items-center">
                    <a href="#" className="text-blue-600 hover:underline font-medium text-sm">
                        Create account
                    </a>
                    <button
                        onClick={handleNext}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded font-medium text-sm"
                    >
                        {step === 'email' ? 'Next' : 'Login'}
                    </button>
                </div>
            </div>

            <footer className="mt-6 text-sm text-gray-500">
                <div className="flex justify-center space-x-6 mb-2">
                    <a href="#" className="hover:underline">Help</a>
                    <a href="#" className="hover:underline">Privacy</a>
                    <a href="#" className="hover:underline">Terms</a>
                </div>
                <select className="text-gray-600 border-none focus:outline-none text-sm">
                    <option>English (US)</option>
                    <option>Português (Brasil)</option>
                </select>
            </footer>
        </div>
    );
}
