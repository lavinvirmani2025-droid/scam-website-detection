{\rtf1\ansi\ansicpg1252\cocoartf2822
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\paperw11900\paperh16840\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\pard\tx566\tx1133\tx1700\tx2267\tx2834\tx3401\tx3968\tx4535\tx5102\tx5669\tx6236\tx6803\pardirnatural\partightenfactor0

\f0\fs24 \cf0 import \{ NextResponse \} from 'next/server'\
\
// TEMP: in-memory users list (replace with real DB later)\
let users: any[] = []\
\
export async function POST(req: Request) \{\
  const \{ name, email, password \} = await req.json()\
\
  const exists = users.find(u => u.email === email)\
  if (exists) \{\
    return NextResponse.json(\{ success: false, message: 'Email already exists' \})\
  \}\
\
  users.push(\{\
    name,\
    email,\
    password,\
    role: 'user'   // signup ONLY creates normal users\
  \})\
\
  return NextResponse.json(\{ success: true \})\
\}\
}