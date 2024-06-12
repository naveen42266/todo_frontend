import {
	Button,
	Container,
	Text,
	Title,
	Modal,
	TextInput,
	Group,
	Card,
	ActionIcon,
	Code,
} from '@mantine/core';
import { useState, useRef, useEffect } from 'react';
import { MoonStars, Sun, Trash } from 'tabler-icons-react';

import {
	MantineProvider,
	ColorSchemeProvider,
	ColorScheme,
} from '@mantine/core';
import { useColorScheme } from '@mantine/hooks';
import { useHotkeys, useLocalStorage } from '@mantine/hooks';

export default function App() {
	const [tasks, setTasks] = useState([]);
	const [opened, setOpened] = useState(false);

	const preferredColorScheme = useColorScheme();
	const [colorScheme, setColorScheme] = useLocalStorage({
		key: 'mantine-color-scheme',
		defaultValue: 'light',
		getInitialValueInEffect: true,
	});
	const toggleColorScheme = value =>
		setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));

	useHotkeys([['mod+J', () => toggleColorScheme()]]);

	const taskTitle = useRef('');
	const taskSummary = useRef('');


	let API_URL = "https://todo-backend-beige-nu.vercel.app/"
	//"https://todo-backend-api-cyan.vercel.app/"
	// "todobackend-production-4a5e.up.railway.app"
	// "https://todo-backend-neon-zeta.vercel.app/"
	// "http://localhost:8080/"

	async function apiCall() {
		fetch(API_URL + "api/todoapp/GetNotes").then(response => response.json())
			.then(data => {
				setTasks(data)
			})
	}
	async function postApi() {
		let newNotes = taskTitle.current.value
		const data = new FormData()
		data.append("newNotes", newNotes)
		fetch(API_URL + "api/todoapp/AddNotes", {
			method: "POST",
			body: data
		}).then(response => response.json())
			.then(data => {
				alert(data)
				apiCall()
			})
			taskTitle.current.value=''
	}

	async function updateApi(each) {

		let updatedNotes = each.description
		const data = new FormData()
		data.append("updatedNotes", updatedNotes)
		fetch(API_URL + "api/todoapp/UpdateNotes?id=" + each?.id, {
			method: "PUT",
			body: data
		}).then(response => response.json())
			.then(data => {
				alert(data)
				apiCall()
			})
	}
	async function deleteApi(id) {
		fetch(API_URL + "api/todoapp/DeleteNotes?id=" + id, {
			method: "DELETE"
		}).then(response => response.json())
			.then(data => {
				alert(data)
				apiCall()
			})
	}
	useEffect(() => {
		apiCall()
	}, [])


	return (
		<ColorSchemeProvider
			colorScheme={colorScheme}
			toggleColorScheme={toggleColorScheme}>
			<MantineProvider
				theme={{ colorScheme, defaultRadius: 'md' }}
				withGlobalStyles
				withNormalizeCSS>
				<div className='App'>
					<Modal
						opened={opened}
						size={'md'}
						title={'New Task'}
						withCloseButton={false}
						onClose={() => {
							setOpened(false);
						}}
						centered>
						<TextInput
							mt={'md'}
							ref={taskTitle}
							placeholder={'Task Title'}
							required
							label={'Title'}
						/>
						<TextInput
							ref={taskSummary}
							mt={'md'}
							placeholder={'Task Summary'}
							label={'Summary'}
						/>
						<Group mt={'md'} position={'apart'}>
							<Button
								onClick={() => {
									setOpened(false);
								}}
								variant={'subtle'}>
								Cancel
							</Button>
							<Button
								onClick={() => {
									setOpened(false);
								}}>
								Create Task
							</Button>
						</Group>
					</Modal>
					<Container size={550} my={40}>
						<Group position={'apart'}>
							<Title
								sx={theme => ({
									fontFamily: `Greycliff CF, ${theme.fontFamily}`,
									fontWeight: 900,
								})}>
								My Tasks
							</Title>
							<ActionIcon
								color={'blue'}
								onClick={() => toggleColorScheme()}
								size='lg'>
								{colorScheme === 'dark' ? (
									<Sun size={16} />
								) : (
									<MoonStars size={16} />
								)}
							</ActionIcon>
						</Group>
						<div style={{ display: 'flex', alignItems: 'center', gap: '6px',paddingBottom:"10px", paddingTop:"15px" }}>
							<TextInput
								style={{ marginTop: 'md', flex: 1 }}
								ref={taskTitle}
								placeholder="Task Title"
								required
							// label="Title"
							/>
							<Button
								style={{ marginTop: 'md' }}
								onClick={() => { postApi(); }}
							>
								New Task
							</Button>
						</div>
						<Text weight={'bold'} size={'lg'} mt={'md'} color={'#228be6'}>
								To Do List's
							</Text>
						{tasks.length > 0 ? (
							tasks.map((task, index) => {
								if (task.type !== "done") {
									return (
										<Card withBorder key={index} mt={'sm'}>
											<Group position={'apart'}>
												<Text weight={'bold'}>{task.description}</Text>
												<ActionIcon
													onClick={() => {
														updateApi(task);
													}}
													color={'red'}
													variant={'transparent'}>
													<Trash />
												</ActionIcon>
											</Group>
											{/* <Text color={'dimmed'} size={'md'} mt={'sm'}>
												{task.summary
													? task.summary
													: 'No summary was provided for this task'}
											</Text> */}
										</Card>
									);
								}
							})
						) : (
							<Text size={'lg'} mt={'md'} color={'dimmed'}>
								You have no tasks
							</Text>
						)}
						<Text weight={'bold'} size={'lg'} mt={'md'} color={'#228be6'}>
								 Done List's
							</Text>
							{tasks.length > 0 ? (
							tasks.map((task, index) => {
								if (task.type === "done") {
									return (
										<Card withBorder key={index} mt={'sm'}>
											<Group position={'apart'}>
												<Text weight={'bold'}>{task.description}</Text>
												<ActionIcon
													onClick={() => {
														deleteApi(task.id);
													}}
													color={'red'}
													variant={'transparent'}>
													<Trash />
												</ActionIcon>
											</Group>
											{/* <Text color={'dimmed'} size={'md'} mt={'sm'}>
												{task.summary
													? task.summary
													: 'No summary was provided for this task'}
											</Text> */}
										</Card>
									);
								}
							})
						) : (
							<Text size={'lg'} mt={'md'} color={'dimmed'}>
								You have no tasks
							</Text>
						)}
					</Container>
				</div>
			</MantineProvider>
		</ColorSchemeProvider>
	);
}
