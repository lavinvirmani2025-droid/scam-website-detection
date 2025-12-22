{\rtf1\ansi\ansicpg1252\cocoartf2822
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\paperw11900\paperh16840\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\pard\tx566\tx1133\tx1700\tx2267\tx2834\tx3401\tx3968\tx4535\tx5102\tx5669\tx6236\tx6803\pardirnatural\partightenfactor0

\f0\fs24 \cf0 'use client'\
import \{ useState \} from 'react'\
\
export default function ForgotPassword() \{\
  const [email, setEmail] = useState('')\
\
  const handleSubmit = async (e:any) => \{\
    e.preventDefault()\
\
    const res = await fetch('/api/auth/forgot', \{\
      method:'POST',\
      headers:\{'Content-Type':'application/json'\},\
      body:JSON.stringify(\{ email \})\
    \})\
\
    const data = await res.json()\
    alert(data.message)\
  \}\
\
  return (\
    <div className="flex items-center justify-center h-screen">\
      <form onSubmit=\{handleSubmit\} className="p-6 border rounded-xl w-80 space-y-3">\
        <h2 className="text-xl font-bold">Reset Password</h2>\
\
        <input type="email" placeholder="Email"\
        className="w-full p-2 border rounded"\
        onChange=\{(e)=>setEmail(e.target.value)\} />\
\
        <button className="w-full bg-blue-600 text-white p-2 rounded">\
          Send Reset Link\
        </button>\
      </form>\
    </div>\
  )\
\}\
}