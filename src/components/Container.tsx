import { forwardRef, HTMLProps } from "react";
import clsx from "clsx";

type OuterContainerProps = HTMLProps<HTMLDivElement>;

const OuterContainer = forwardRef<HTMLDivElement, OuterContainerProps>(
  function OuterContainer({ className, children, ...props }, ref) {
    return (
      <div
        ref={ref}
        className={clsx("sm:px-8 pb-3 bg-[#343541]", className)}
        {...props}
      >
        <div className="flex justify-center items-center pt-1">
          <img
            className="h-10 mr-1"
            src="/upw-squared-logo.png"
            alt="upwork-logo"
          />
          <span className="text-center text-lg font-bold text-white">
            helper
          </span>
        </div>
        <div className="mx-3 mt-1 bg-[#444654] rounded">{children}</div>
      </div>
    );
  }
);

type InnerContainerProps = HTMLProps<HTMLDivElement>;

const InnerContainer = forwardRef<HTMLDivElement, InnerContainerProps>(
  function InnerContainer({ className, children, ...props }, ref) {
    return (
      <div
        ref={ref}
        className={clsx(
          "flex-col p-3 space-y-5 min-w-[400px] min-h-[400px]",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

type ContainerProps = HTMLProps<HTMLDivElement>;

const Container = forwardRef<HTMLDivElement, ContainerProps>(function Container(
  { children, ...props },
  ref
) {
  return (
    <OuterContainer ref={ref as any} {...props}>
      <InnerContainer>{children}</InnerContainer>
    </OuterContainer>
  );
});

export { Container, OuterContainer, InnerContainer };
