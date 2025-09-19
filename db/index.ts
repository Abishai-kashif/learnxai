import { Session } from "@/types";

export async function fetchCurrentSession(id: string | undefined) {
    try {
        
        const BASE_URL = process.env.PYTHON_API_URL || "http://localhost:8001";
        const URL = `${BASE_URL}/sessions/${id}`;
    
        if (!id) return [];
    
        const response = await fetch(URL, {
            method: "GET",
            // headers: {
            // 	Authorization: `Bearer ${token}`,
            // },
        });
    
        if (!response.ok) {
            throw Error("Error! in fetching user!");
        }
        return (await response.json()) || [];
    } catch (error) {
        console.error("Something went wrong while fetching Session: ", error)
        return []
    }
}

// export async function createSession(session: Session) {
//     try {
// 			const BASE_URL = process.env.PYTHON_API_URL || "http://localhost:8001";
// 			const URL = `${BASE_URL}/sessions/`;

// 			const response = await fetch(URL, {
// 				method: "POST",
// 				body: JSON.stringify(session),
// 				headers: {
// 					"Content-Type": "application/json"
// 				},
// 			});

// 			if (!response.ok) {
// 				throw Error("Error! in fetching user!");
// 			}
// 			return (await response.json())?.id || null;
// 		} catch (error) {
// 			console.error("Something went wrong while fetching Session: ", error);
// 			return '';
// 		}
// }

export async function fetchUser() {
    const _user = {
        name: "Abishai from Daraz",
        email: "abishaikashif975@gmail.com",
        id: '1',
    };

    try {
        const BASE_URL = process.env.PYTHON_API_URL || "http://localhost:8001";
        const URL = `${BASE_URL}/me`;
        const token =
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhYmlzaGFpa2FzaGlmOTc1QGdtYWlsLmNvbSIsImV4cCI6MTc1ODI2Mjk0NH0.sY1FV9dCeDYMih0jX5hP44fS3K7AG1uTlvwts9nCjtk";
    
        console.log("fetching user with: ", token);
        const response = await fetch(URL, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    
        if (!response.ok) {
            console.error("Error! in fetching user!");
            return _user
        }
        return await response.json();
    } catch (error) {
        return _user
    }
}

// export async function fetchSessions(userId: string | undefined): Promise<Session> {
// 	// const recentSessions = [
// 	// 	{
// 	// 		title: "Machine Learning Basics",
// 	// 		subtitle: "What is supervised learning and how does it differ from...",
// 	// 		time: "2 hours ago",
// 	// 		status: "Quiz Generated",
// 	// 		statusColor: "bg-green-100 text-green-700",
// 	// 	},
// 	// 	{
// 	// 		title: "Python Data Structures",
// 	// 		subtitle: "Can you explain the difference between lists and tuples...",
// 	// 		time: "1 day ago",
// 	// 		status: "Study Plan",
// 	// 		statusColor: "bg-blue-100 text-blue-700",
// 	// 	},
// 	// 	{
// 	// 		title: "React Hooks Deep Dive",
// 	// 		subtitle: "How do I use useEffect with cleanup functions...",
// 	// 		time: "3 days ago",
// 	// 		status: "Completed",
// 	// 		statusColor: "bg-gray-100 text-gray-700",
// 	// 	},
// 	// 	{
// 	// 		title: "Database Design Principles",
// 	// 		subtitle: "What are the best practices for normalizing...",
// 	// 		time: "5 days ago",
// 	// 		status: "Completed",
// 	// 		statusColor: "bg-purple-100 text-purple-700",
// 	// 	},
// 	// ];
// 	if (!userId) return [];

// 	try {
// 		const BASE_URL = process.env.PYTHON_API_URL || "http://localhost:8001";
// 		const URL = `${BASE_URL}/sessions/${userId}`;

// 		const response = await fetch(URL);

// 		return [];
// 	} catch (error) {
// 		console.error("Something went wrong while fetching Sessions: ", error);
// 		return [];
// 	}
// } 