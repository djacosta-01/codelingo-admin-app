'use client'
import { Box, Stack, Paper, Typography, Container } from '@mui/material';
import { getLessonData, type Lesson} from '@/app/student/[class_id]/lessons/actions';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { GridRowsProp } from '@mui/x-data-grid';

const Lessons = ({ params }: { params: { class_id: number } }) => {
  const [rows, setRows] = useState<GridRowsProp>([]);
  const [prevLessonData, setPrevLessonData] = useState<Lesson | null>(null);
  const router = useRouter();

  const routeToLesson = (id: number) => {
    const lessonName = rows.find(row => row.id === id)?.col1;
    router.push(`/student/${params.class_id}/lessons/${lessonName}`);
  };

  useEffect(() => {
    const fetchLessons = async () => {
      const data = await getLessonData(params.class_id);
      console.log('data', data)
      const lessons = data.map(({ lesson_id, name, topics }) => ({
        id: lesson_id,
        col1: name,
        col2: topics?.join(', '),
      }));
      setRows(lessons);
    };
    fetchLessons();
  }, [params.class_id]);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Your Lessons
      </Typography>

      <Stack spacing={2}>
        {rows.map((row) => (
          <Paper
            key={row.id}
            sx={{
              p: 2,
              cursor: 'pointer',
              '&:hover': {
                boxShadow: 3,
                transition: 'box-shadow 0.2s'
              }
            }}
            onClick={() => routeToLesson(row.id)}
          >
            <Typography variant="h6" sx={{ mb: 1 }}>
              {row.col1}
            </Typography>

            {row.col2 && (
              <Box>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                  Topics:
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  {row.col2.split(', ').map((topic: string, index: number) => (
                    <Box
                      key={index}
                      sx={{
                        bgcolor: 'primary.light',
                        color: 'primary.dark',
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                        fontSize: '0.875rem'
                      }}
                    >
                      {topic}
                    </Box>
                  ))}
                </Stack>
              </Box>
            )}
          </Paper>
        ))}
      </Stack>

      {rows.length === 0 && (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="h6" color="text.secondary">
            No lessons available yet
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default Lessons;
