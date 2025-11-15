import { createContext } from "react"

/**
 * @description 主题变量
 */
const ThemeContext = createContext({
    theme:"light",
    change:()=>{}
})

export default ThemeContext