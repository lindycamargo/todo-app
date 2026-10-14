import { useEffect, useState } from 'react';
import  { Task } from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TASK_KEY = "@task_key"

export function useTasks() {
    const [tasks, setTasks] = useState<Task[]>([]);

    const [isInitialLoad, setIsInitialLoad] = useState(true);

    // 1. Carregar dados ao Iniciar
    useEffect(() => {
        const loadTasks = async () => {
            try {
                const storedTasks = await AsyncStorage.getItem(TASK_KEY);
                if (storedTasks) {
                    setTasks(JSON.parse(storedTasks));
                }
            } catch (error) {
                console.error('Erro ao carregar tarefas:', error);
            } finally {
                setIsInitialLoad(false);
            }
        };

        loadTasks();
    }, []);

    // 2. Salvar dados quando houver mudanças (ignorando a primeira carga vazia)
    useEffect(() => {
        if (isInitialLoad) return;
        
        const saveTasks = async () => {
            try {
                await AsyncStorage.setItem(TASK_KEY, JSON.stringify(tasks));
            } catch (error) {
                console.error('Erro ao salvar tarefas:', error);
            }
        };

        saveTasks();
    }, [tasks, isInitialLoad]);

    // 3. Função para adicionar uma nova tarefa
    const addTasks = (text: string) => {
        if (text.trim() === '') return;
        const newTask: Task = {
            id: Date.now().toString(),
            text
        };

        // Atualiza o estado das tarefas
        setTasks(prevTasks => [...prevTasks, newTask]);
    }

    //Função para remover uma tarefa
    const removeTask = (id: string) => {
        setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
    }

    // Função para editar uma tarefa
    const editTask = (id: string, newText: string) => {
        if (newText.trim() === '') return;
        setTasks(prevTasks => prevTasks.map(task => 
            task.id === id ? { ...task, text: newText } : task
        ));
    }

    return { tasks, addTasks, removeTask, editTask };
}