'use client'

import { getLessonData } from './action';
import React, {useEffect, useState} from 'react';
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid2';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';


interface Question {
    questionId: number
    questionType: string
    prompt: string
    snippet: string
    topics: string[]
    answerOptions: string[]
    answer: string
}

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    ...theme.applyStyles('dark', {
      backgroundColor: '#1A2027',
    }),
  }));

const QuestionPage = ({ params }: { params: { lesson_id: number } }) => {
    const [questions, setQuestions] = useState <Question[]>([]);
    const {selectedAnswers, setSelectedAnswers} = useState<string | null> (null);

    return (
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
            <Grid size={6}>
                <Item>1</Item>
            </Grid>
            <Grid size={6}>
                <Item>2</Item>
            </Grid>
            <Grid size={6}>
                <Item>3</Item>
            </Grid>
            <Grid size={6}>
                <Item>4</Item>
            </Grid>
        </Grid>
    )
}