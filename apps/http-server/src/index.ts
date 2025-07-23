
import express, { Request, Response } from "express";
import { CreateRoomSchema, CreateUserSchema, SigninSchema } from "@repo/comon/types"
import { prismaClient } from "@repo/db/client"
import bcrypt from 'bcrypt';
import { JWT_SECRET, SATROUNDS } from "@repo/backend-comon/config";
import jwt from "jsonwebtoken";
import { authMiddleware } from "./middleware"
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

app.post('/signup', async (req: Request, res: Response): Promise<any> => {

  const parseData = CreateUserSchema.safeParse(req.body);

  if (!parseData.success) {
    return res.status(400).json({
        message: "Incorrect inputs"
    })
  }
  
  const existingUser = await prismaClient.user.findFirst({
    where: {
        email: parseData.data.username
    }
  });

  if (existingUser) {
    return res.status(411).json({
        message: "Username already taken."
    })
  }

  const salt = await bcrypt.genSalt(Number(SATROUNDS));
  const hashedPassword = await bcrypt.hash(parseData.data.password, salt);

  try {

    const user = await prismaClient.user.create({
        data: {
            name: parseData.data.name,
            password: hashedPassword,
            email: parseData.data.username,
            photo: ""
        }
    })

    const userId = user.id;

    const token = jwt.sign({
        userId
    }, JWT_SECRET);

    return res.status(200).json({
        message: 'User created',
        token: token,
        userId: userId
    });

  } catch (error) {
    if (error instanceof Error) {
        console.error('Error while creating user: ', error);
        res.status(400).json({
            error: 'Error while creating user: ' + error.message
        })
    } else {
        res.status(400).json({
        error: 'Unknown error occurred.'
        });
    }
  }
});

app.post('/singin', async (req: Request, res: Response): Promise<any> => {

  const parseData = SigninSchema.safeParse(req.body);

  if (!parseData.success) {
    return res.status(411).json({
        message: "Incorrect inputs"
    })
  }

  try {
    const user = await prismaClient.user.findFirst({
        where: {
            email: parseData.data.username
        }
    });
    
    if (!user) {
      return res.status(400).json({
        error: 'Invalid Email'
      });
    }
    
    console.log(user);
    const match = await bcrypt.compare(parseData.data.password, user.password);
    const userId = user.id;

    if (match) {
        
        const token = jwt.sign({
            userId
        }, JWT_SECRET);

        return res.status(201).json({
            message: 'Signin successfull',
            token: token,
            userId: userId
        });        
    } else {
        return res.status(400).json({
            message: 'Incorrect Password'
        })
    }

  } catch (error) {
    if (error instanceof Error) {
        console.error('Error while getting user: ', error);
        return res.status(400).json({
            error: "Error while logging: " + error.message
        })
    } else {
        res.status(400).json({
        error: 'Unknown error occurred.'
        });
    }
  }
});

app.post('/room', authMiddleware, async (req: Request, res: Response): Promise<any> => {

  const parseData = CreateRoomSchema.safeParse(req.body);

  if (!parseData.success) {
    return res.status(411).json({
        message: "Incorrect inputs"
    })
  }

  try {
    const userId = req.userId;

    const room = await prismaClient.room.create({
      data: {
        slug: parseData.data.room,
        adminId: userId
      }
    })

    return res.status(200).json({
      roomId: room.id
    })

  } catch (error) {
    if (error instanceof Error) {
        console.error('Error while creating room: ', error);
        return res.status(400).json({
            error: "Error while creating room: " + error.message
        })
    } else {
        res.status(400).json({
        error: 'Unknown error occurred.'
        });
    }
  }
});

app.get('/room/:slug', authMiddleware, async (req: Request, res: Response): Promise<any> => {

  const slug = req.params.slug;

  try {
    const room = await prismaClient.room.findFirst({
      where: {
        slug
      }
    })

    return res.status(200).json({
      room
    })

  } catch (error) {
    if (error instanceof Error) {
        console.error('Error while getting room id: ', error);
        return res.status(400).json({
            error: "Error while getting room id: " + error.message
        })
    } else {
        res.status(400).json({
        error: 'Unknown error occurred.'
        });
    }
  }
});

app.get('/chats/:roomId', authMiddleware, async (req: Request, res: Response): Promise<any> => {
  const roomId = Number(req.params.roomId);
  const messages = await prismaClient.chat.findMany({
    where: {
      roomId: roomId
    },
    orderBy: {
      id: "desc"
    },
    take: 50
  });

  return res.status(200).json({
    messages
  })
})

app.listen(3001);
