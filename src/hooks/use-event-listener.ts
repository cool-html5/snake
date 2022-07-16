import {useEffect, useRef} from "react"

// Taken from https://usehooks.com/useEventListener/
export function useEventListener(
	eventName: string,
	handler: (event: Event) => void,
	element = window
) {
	const savedHandler = useRef(handler)

	useEffect(() => {
		savedHandler.current = handler
	}, [handler])

	useEffect(() => {
		if (!element || !element.addEventListener) {
			return
		}

		const eventListener = (event: Event) => savedHandler.current(event)
		element.addEventListener(eventName, eventListener)

		return () => {
			element.removeEventListener(eventName, eventListener)
		}
	}, [eventName, element])
}
