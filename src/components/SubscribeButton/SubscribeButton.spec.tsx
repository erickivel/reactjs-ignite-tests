import { render, screen, fireEvent } from "@testing-library/react";
import { mocked } from 'jest-mock';
import { signIn } from "next-auth/react";
import { SubscribeButton } from ".";

jest.mock("next-auth/react", () => {
  return {
    useSession() {
      return [null, false]
    }
  }
});

describe("SubscribeButton component", () => {
  it("renders correctly", () => {
    render(<SubscribeButton />);

    expect(screen.getByText("Subscribe Now")).toBeInTheDocument();
  });

  it('redirects user to sign in when not authenticated', () => {
    // const signInMocked = mocked(signIn);

    const signInWasCalled = jest.fn(signIn);

    render(<SubscribeButton />);

    const subscribeButton = screen.getByText("Subscribe Now");

    fireEvent.click(subscribeButton)

    expect(signInWasCalled).toHaveBeenCalled()
  })
});