import ExitIcon from "@/assets/images/icons/exit.svg?react";

interface IModal {
	exitModal: () => void;
	children: React.ReactNode;
}

function Modal({ exitModal, children }: IModal) {
	return (
		<div className="fixed top-0 left-0 bottom-0 right-0 z-[10000] bg-[rgb(0,0,0,.65)]">
			<div
				className="absolute cursor-pointer flex flex-row justify-end box-content p-[8px] top-[10px] right-[10px]"
				onClick={exitModal}
			>
				<ExitIcon className="text-white w-[18px] h-[18px]" />
			</div>
			<div className="flex items-center justify-center w-full h-full">
				{children}
			</div>
		</div>
	);
}

export default Modal;
