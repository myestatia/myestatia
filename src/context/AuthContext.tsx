import React, { createContext, useContext, useState, useEffect } from "react";
import { client } from "@/api/client";

interface Agent {
    id: string;
    name: string;
    email: string;
    role: string;
    company_id: string;
}

interface AuthContextType {
    token: string | null;
    agent: Agent | null;
    login: (token: string, agent: Agent) => void;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
    const [agent, setAgent] = useState<Agent | null>(() => {
        const savedAgent = localStorage.getItem("agent");
        return savedAgent ? JSON.parse(savedAgent) : null;
    });

    useEffect(() => {
        if (token) {
            localStorage.setItem("token", token);
        } else {
            localStorage.removeItem("token");
        }
    }, [token]);

    useEffect(() => {
        if (agent) {
            localStorage.setItem("agent", JSON.stringify(agent));
        } else {
            localStorage.removeItem("agent");
        }
    }, [agent]);

    const login = (newToken: string, newAgent: Agent) => {
        setToken(newToken);
        setAgent(newAgent);
    };

    const logout = () => {
        setToken(null);
        setAgent(null);
        // Optional: client.defaults.headers.common['Authorization'] = ''; 
    };

    const isAuthenticated = !!token;

    return (
        <AuthContext.Provider value={{ token, agent, login, logout, isAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
