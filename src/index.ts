import express from 'express';
import cors from 'cors';
import flashCardRoute from './routes/flashCardRoute';
import authRoute from './routes/authRoute';
import helloWorld from './routes/helloWorld';
// import { apiRateLimiter, authRateLimiter } from './rateLimiter';

const PORT = process.env.PORT || 3000;
const app = express();

// CORS Configuration
const corsOptions = {
	origin: [
		'https://frontend-flash-61iiaohr4-fyzanshaiks-projects.vercel.app',
		'https://frontend-flash-phi.vercel.app',
		'http://localhost:5173',
		'http://ec2-13-60-197-192.eu-north-1.compute.amazonaws.com',
	],
	methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
	credentials: true,
	allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));

app.use(express.json());

// Apply CORS middleware
app.use(cors(corsOptions));

// Handle CORS preflight requests
app.options('*', cors(corsOptions));

// Route handlers
app.use('/api', flashCardRoute);
app.use('/api/auth', authRoute);
app.use('/', helloWorld);

app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;
