// const scrollAreaRef = useRef<HTMLDivElement>(null)
  // const abortControllerRef = useRef<AbortController | null>(null)
  // const [input, setInput] = useState("");

  // const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
  //   const _input = e.target.value;
  //   setInput(_input);

  //   if (_input === "") {
  //     return;
  //   }

  //   setSession([
  //     ...session,
  //     {
  //       role: "user",
  //       content: _input
  //     }
  //   ]);

  // }

  // const scrollToBottom = () => {
  //   if (scrollAreaRef.current) {
  //     const scrollContainer = scrollAreaRef.current.querySelector("[data-radix-scroll-area-viewport]")
  //     console.log('scroll container: ', scrollContainer)
  //     if (scrollContainer) {
  //       scrollContainer.scrollTop = scrollContainer.scrollHeight
  //     }
  //   }
  // }

  // useEffect(() => {
  //   console.log('use effect triggered')
  //   scrollToBottom()
  // }, [session, currentResponse])


// export interface QuizData {
//   title?: string
//   estimatedTime?: string
//   questions: QuizQuestion[] // Array of quiz questions
//   currentQuestionIndex?: number // Track which question we're showing
// }

// export interface QuizData {
//   title?: string
//   estimatedTime?: string
//   questions: QuizQuestion[] // Array of quiz questions
//   currentQuestionIndex?: number // Track which question we're showing
// }