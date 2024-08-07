export declare class KeyUtils {
    static getKeyModifiers(evt: MouseEvent | KeyboardEvent): number;
    static getShortcutCode(keyCode: number, isCtrlKey: boolean, isShiftKey: boolean, isAltKey: boolean, isMetaKey: boolean): number;
    static getShortcutCodeByEvent(evt: KeyboardEvent): number;
    static getEventKeyCode(evt: KeyboardEvent): number;
    static parseShortcutString(shortcutString: string): number;
}
export declare enum ModifierKey {
    None = 0,
    Ctrl = 65536,
    Shift = 262144,
    Alt = 1048576,
    Meta = 16777216
}
export declare enum KeyCode {
    Backspace = 8,
    Tab = 9,
    Enter = 13,
    Pause = 19,
    CapsLock = 20,
    Esc = 27,
    Space = 32,
    PageUp = 33,
    PageDown = 34,
    End = 35,
    Home = 36,
    Left = 37,
    Up = 38,
    Right = 39,
    Down = 40,
    Insert = 45,
    Delete = 46,
    Key_0 = 48,
    Key_1 = 49,
    Key_2 = 50,
    Key_3 = 51,
    Key_4 = 52,
    Key_5 = 53,
    Key_6 = 54,
    Key_7 = 55,
    Key_8 = 56,
    Key_9 = 57,
    Key_a = 65,
    Key_b = 66,
    Key_c = 67,
    Key_d = 68,
    Key_e = 69,
    Key_f = 70,
    Key_g = 71,
    Key_h = 72,
    Key_i = 73,
    Key_j = 74,
    Key_k = 75,
    Key_l = 76,
    Key_m = 77,
    Key_n = 78,
    Key_o = 79,
    Key_p = 80,
    Key_q = 81,
    Key_r = 82,
    Key_s = 83,
    Key_t = 84,
    Key_u = 85,
    Key_v = 86,
    Key_w = 87,
    Key_x = 88,
    Key_y = 89,
    Key_z = 90,
    Windows = 91,
    ContextMenu = 93,
    Numpad_0 = 96,
    Numpad_1 = 97,
    Numpad_2 = 98,
    Numpad_3 = 99,
    Numpad_4 = 100,
    Numpad_5 = 101,
    Numpad_6 = 102,
    Numpad_7 = 103,
    Numpad_8 = 104,
    Numpad_9 = 105,
    Multiply = 106,
    Add = 107,
    Subtract = 109,
    Decimal = 110,
    Divide = 111,
    F1 = 112,
    F2 = 113,
    F3 = 114,
    F4 = 115,
    F5 = 116,
    F6 = 117,
    F7 = 118,
    F8 = 119,
    F9 = 120,
    F10 = 121,
    F11 = 122,
    F12 = 123,
    NumLock = 144,
    ScrollLock = 145,
    Semicolon = 186,
    Equals = 187,
    Comma = 188,
    Dash = 189,
    Period = 190,
    ForwardSlash = 191,
    GraveAccent = 192,
    OpenBracket = 219,
    BackSlash = 220,
    CloseBracket = 221,
    SingleQuote = 222
}
//# sourceMappingURL=key.d.ts.map