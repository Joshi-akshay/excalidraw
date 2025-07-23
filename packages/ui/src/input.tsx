interface InputProps {
    placeholder: string;
    reference?: any
  }

export function Input({placeholder, reference}: InputProps) {
    return (<div className="p-2 m-2 border rounded-lg shadow-sm">
        <input ref={reference} type="input" placeholder={placeholder} className="rounded-sm bg-slate-100"/>
    </div>)
}