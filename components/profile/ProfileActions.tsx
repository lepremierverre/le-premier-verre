"use client";

import { FormEvent, useRef, useState } from "react";
import {
  useSession,
  useUser,
  useReverification,
} from "@clerk/nextjs";

type ProfileActionsProps = {
  locale: "fr" | "en";
};

type Panel = "identity" | "email" | "password" | null;

export default function ProfileActions({ locale }: ProfileActionsProps) {
  const { user, isLoaded } = useUser();
  const { session } = useSession();
  const isEn = locale === "en";

  const reverificationRef = useRef<{
    complete: () => void;
    cancel: () => void;
    level: "first_factor" | "second_factor" | "multi_factor" | undefined;
  } | null>(null);

  const [panel, setPanel] = useState<Panel>(null);
  const [firstName, setFirstName] = useState(user?.firstName ?? "");
  const [lastName, setLastName] = useState(user?.lastName ?? "");
  const [email, setEmail] = useState("");
  const [emailResourceId, setEmailResourceId] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [reverificationCode, setReverificationCode] = useState("");
  const [needsReverification, setNeedsReverification] = useState(false);
  const [reverificationEmail, setReverificationEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [forgotPasswordStep, setForgotPasswordStep] = useState<
    "idle" | "code" | "new-password"
  >("idle");
  const [forgotPasswordCode, setForgotPasswordCode] = useState("");
  const [forgotNewPassword, setForgotNewPassword] = useState("");
  const [showForgotNewPassword, setShowForgotNewPassword] = useState(false);
  const [signOutOthers, setSignOutOthers] = useState(true);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const primaryEmail =
    user?.primaryEmailAddress?.emailAddress ??
    user?.emailAddresses?.[0]?.emailAddress ??
    "";

  const copy = isEn
    ? {
        identity: "Personal information",
        identityDescription: "Update your name and profile information.",
        email: "Email and connections",
        emailDescription: "Manage your email address.",
        password: "Password and security",
        passwordDescription: "Change your password and protect your account.",
        firstName: "First name",
        lastName: "Last name",
        currentEmail: "Current email",
        newEmail: "New email address",
        verificationCode: "Verification code",
        securityCheck: "Security check",
        securityCheckDescription:
          "Before changing your email, confirm that it's really you.",
        securityCodeSent: "We sent a verification code to",
        securityCode: "Security code",
        confirmIdentity: "Confirm my identity",
        securityCodeError: "The code could not be verified. Please try again.",
        securityUnavailable:
          "We couldn't start the security check. Please try again.",
        currentPassword: "Current password",
        newPassword: "New password",
        showPassword: "Show",
        hidePassword: "Hide",
        forgotPassword: "Forgot password?",
        forgotPasswordTitle: "Reset your password",
        forgotPasswordDescription:
          "We'll send a security code to the email address associated with your account.",
        sendResetCode: "Send security code",
        resetCodeSent: "A security code has been sent to",
        resetCode: "Security code",
        verifyResetCode: "Verify code",
        chooseNewPassword: "Choose a new password",
        chooseNewPasswordDescription:
          "Your identity has been verified. You can now choose a new password.",
        resetPassword: "Reset password",
        passwordResetSuccess: "Your password has been reset.",
        invalidResetCode: "The security code is invalid or has expired. Please try again.",
        resetUnavailable:
          "We couldn't start the password reset. Please try again.",
        backToPassword: "Back to password change",
        signOutOthers: "Sign me out of my other active sessions",
        save: "Save changes",
        sendCode: "Send verification code",
        verify: "Verify email",
        updatePassword: "Update password",
        cancel: "Cancel",
        identitySaved: "Your information has been updated.",
        codeSent: "A verification code has been sent to your new email address.",
        emailSaved: "Your email address has been verified.",
        passwordSaved: "Your password has been updated.",
        genericError: "Something went wrong. Please try again.",
      }
    : {
        identity: "Informations personnelles",
        identityDescription: "Modifier mon nom et mes informations de profil.",
        email: "Courriel et connexions",
        emailDescription: "Gérer mon adresse courriel.",
        password: "Mot de passe et sécurité",
        passwordDescription: "Modifier mon mot de passe et protéger mon compte.",
        firstName: "Prénom",
        lastName: "Nom",
        currentEmail: "Courriel actuel",
        newEmail: "Nouvelle adresse courriel",
        verificationCode: "Code de vérification",
        securityCheck: "Vérification de sécurité",
        securityCheckDescription:
          "Avant de modifier ton courriel, confirme que c’est bien toi.",
        securityCodeSent: "On a envoyé un code de vérification à",
        securityCode: "Code de sécurité",
        confirmIdentity: "Confirmer mon identité",
        securityCodeError: "Le code n’a pas pu être vérifié. Réessaie.",
        securityUnavailable:
          "Impossible de démarrer la vérification de sécurité. Réessaie.",
        currentPassword: "Mot de passe actuel",
        newPassword: "Nouveau mot de passe",
        showPassword: "Afficher",
        hidePassword: "Masquer",
        forgotPassword: "Mot de passe oublié?",
        forgotPasswordTitle: "Réinitialiser ton mot de passe",
        forgotPasswordDescription:
          "On va envoyer un code de sécurité à l’adresse courriel associée à ton compte.",
        sendResetCode: "Envoyer le code de sécurité",
        resetCodeSent: "Un code de sécurité a été envoyé à",
        resetCode: "Code de sécurité",
        verifyResetCode: "Vérifier le code",
        chooseNewPassword: "Choisir un nouveau mot de passe",
        chooseNewPasswordDescription:
          "Ton identité a été vérifiée. Tu peux maintenant choisir un nouveau mot de passe.",
        resetPassword: "Réinitialiser le mot de passe",
        passwordResetSuccess: "Ton mot de passe a été réinitialisé.",
        invalidResetCode:
          "Le code de sécurité est invalide ou a expiré. Réessaie.",
        resetUnavailable:
          "Impossible de démarrer la réinitialisation du mot de passe. Réessaie.",
        backToPassword: "Retour à la modification du mot de passe",
        signOutOthers: "Me déconnecter de mes autres sessions actives",
        save: "Enregistrer",
        sendCode: "Envoyer le code de vérification",
        verify: "Vérifier le courriel",
        updatePassword: "Modifier le mot de passe",
        cancel: "Annuler",
        identitySaved: "Tes informations ont été mises à jour.",
        codeSent:
          "Un code de vérification a été envoyé à ta nouvelle adresse courriel.",
        emailSaved: "Ton adresse courriel a été vérifiée.",
        passwordSaved: "Ton mot de passe a été mis à jour.",
        genericError: "Une erreur est survenue. Réessaie.",
      };

  const resetFeedback = () => {
    setMessage("");
    setError("");
  };

  const togglePanel = (next: Exclude<Panel, null>) => {
    resetFeedback();

    if (panel === next) {
      setPanel(null);
      return;
    }

    if (next === "identity") {
      setFirstName(user?.firstName ?? "");
      setLastName(user?.lastName ?? "");
    }

    setPanel(next);
  };

  const getErrorMessage = (err: unknown) => {
    if (
      typeof err === "object" &&
      err !== null &&
      "errors" in err &&
      Array.isArray((err as { errors?: unknown[] }).errors)
    ) {
      const firstError = (
        err as {
          errors?: Array<{
            longMessage?: string;
            message?: string;
          }>;
        }
      ).errors?.[0];

      const clerkMessage =
        firstError?.longMessage || firstError?.message || "";

      const normalizedMessage = clerkMessage.toLowerCase();

      if (
        normalizedMessage.includes("online data breach") ||
        normalizedMessage.includes("data breach")
      ) {
        return isEn
          ? "This password has appeared in a known data breach. Choose a different password to protect your account."
          : "Ce mot de passe a été compromis dans une fuite de données connue. Choisis un autre mot de passe pour protéger ton compte.";
      }

      if (normalizedMessage.includes("incorrect password")) {
        return isEn
          ? "Your current password is incorrect."
          : "Ton mot de passe actuel est incorrect.";
      }

      if (normalizedMessage.includes("additional verification")) {
        return isEn
          ? "An additional security check is required."
          : "Une vérification de sécurité supplémentaire est requise.";
      }

      return clerkMessage || copy.genericError;
    }

    return copy.genericError;
  };

  const saveIdentity = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user) return;

    resetFeedback();
    setBusy(true);

    try {
      await user.update({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
      });

      setMessage(copy.identitySaved);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  const createEmailAddressWithReverification = useReverification(
    async (newEmail: string) => {
      if (!user) return undefined;

      return user.createEmailAddress({
        email: newEmail,
      });
    },
    {
      onNeedsReverification: async ({ complete, cancel, level }) => {
        if (!session) {
          cancel();
          setError(copy.securityUnavailable);
          return;
        }

        try {
          const verification = await session.startVerification({
            level: level ?? "first_factor",
          });

          const emailFactor = verification.supportedFirstFactors?.find(
            (factor) =>
              factor.strategy === "email_code" &&
              factor.emailAddressId === user?.primaryEmailAddress?.id,
          ) ??
          verification.supportedFirstFactors?.find(
            (factor) => factor.strategy === "email_code",
          );

          if (!emailFactor || emailFactor.strategy !== "email_code") {
            cancel();
            setError(copy.securityUnavailable);
            return;
          }

          await session.prepareFirstFactorVerification({
            strategy: "email_code",
            emailAddressId: emailFactor.emailAddressId,
          });

          reverificationRef.current = {
            complete,
            cancel,
            level,
          };

          setReverificationEmail(emailFactor.safeIdentifier);
          setReverificationCode("");
          setNeedsReverification(true);
          setBusy(false);
        } catch {
          cancel();
          setError(copy.securityUnavailable);
          setBusy(false);
        }
      },
    },
  );

  const confirmReverification = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!session || !reverificationCode.trim() || !reverificationRef.current) {
      return;
    }

    resetFeedback();
    setBusy(true);

    try {
      const verification = await session.attemptFirstFactorVerification({
        strategy: "email_code",
        code: reverificationCode.trim(),
      });

      if (
        verification.status === "needs_second_factor" ||
        verification.status !== "complete"
      ) {
        throw new Error("Reverification incomplete");
      }

      const { complete } = reverificationRef.current;

      reverificationRef.current = null;
      setNeedsReverification(false);
      setReverificationCode("");
      setReverificationEmail("");

      complete();
    } catch {
      setError(copy.securityCodeError);
      setBusy(false);
    }
  };

  const cancelReverification = () => {
    reverificationRef.current?.cancel();
    reverificationRef.current = null;
    setNeedsReverification(false);
    setReverificationCode("");
    setReverificationEmail("");
    setBusy(false);
    resetFeedback();
  };

  const sendEmailCode = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user || !email.trim()) return;

    resetFeedback();
    setBusy(true);

    try {
      const normalizedEmail = email.trim().toLowerCase();

      const existingEmail = user.emailAddresses.find(
        (item) => item.emailAddress.toLowerCase() === normalizedEmail,
      );

      if (existingEmail) {
        if (existingEmail.verification?.status === "verified") {
          await user.update({
            primaryEmailAddressId: existingEmail.id,
          });

          await user.reload();

          setEmail("");
          setEmailResourceId(null);
          setMessage(copy.emailSaved);
          return;
        }

        await existingEmail.prepareVerification({
          strategy: "email_code",
        });

        setEmailResourceId(existingEmail.id);
        setMessage(copy.codeSent);
        return;
      }

      const emailResource = await createEmailAddressWithReverification(
        normalizedEmail,
      );

      if (!emailResource) {
        return;
      }

      await emailResource.prepareVerification({
        strategy: "email_code",
      });

      setEmailResourceId(emailResource.id);
      setMessage(copy.codeSent);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  const verifyEmail = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user || !emailResourceId || !code.trim()) return;

    resetFeedback();
    setBusy(true);

    try {
      const emailResource = user.emailAddresses.find(
        (item) => item.id === emailResourceId,
      );

      if (!emailResource) {
        throw new Error("Email resource not found");
      }

      const verified = await emailResource.attemptVerification({
        code: code.trim(),
      });

      if (verified.verification?.status !== "verified") {
        throw new Error("Email verification failed");
      }

      await user.update({
        primaryEmailAddressId: verified.id,
      });

      await user.reload();

      setMessage(copy.emailSaved);
      setEmail("");
      setCode("");
      setEmailResourceId(null);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  const startForgotPassword = async () => {
    if (!session) return;

    resetFeedback();
    setBusy(true);

    try {
      const verification = await session.startVerification({
        level: "first_factor",
      });

      const emailFactor = verification.supportedFirstFactors?.find(
        (factor) =>
          factor.strategy === "email_code" &&
          factor.emailAddressId === user?.primaryEmailAddress?.id,
      ) ??
      verification.supportedFirstFactors?.find(
        (factor) => factor.strategy === "email_code",
      );

      if (!emailFactor || emailFactor.strategy !== "email_code") {
        throw new Error("Email verification factor unavailable");
      }

      await session.prepareFirstFactorVerification({
        strategy: "email_code",
        emailAddressId: emailFactor.emailAddressId,
      });

      setForgotPasswordCode("");
      setForgotNewPassword("");
      setForgotPasswordStep("code");
      setMessage(`${copy.resetCodeSent} ${emailFactor.safeIdentifier}.`);
    } catch {
      setError(copy.resetUnavailable);
    } finally {
      setBusy(false);
    }
  };

  const verifyForgotPasswordCode = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!session || !forgotPasswordCode.trim()) return;

    resetFeedback();
    setBusy(true);

    try {
      const verification = await session.attemptFirstFactorVerification({
        strategy: "email_code",
        code: forgotPasswordCode.trim(),
      });

      if (verification.status !== "complete") {
        throw new Error("Password reset verification incomplete");
      }

      setForgotPasswordStep("new-password");
      setMessage("");
    } catch {
      setError(copy.invalidResetCode);
    } finally {
      setBusy(false);
    }
  };

  const submitForgotPassword = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!user || !forgotNewPassword) return;

    resetFeedback();
    setBusy(true);

    try {
      await user.updatePassword({
        newPassword: forgotNewPassword,
        signOutOfOtherSessions: signOutOthers,
      });

      await user.reload();

      setForgotPasswordStep("idle");
      setForgotPasswordCode("");
      setForgotNewPassword("");
      setShowForgotNewPassword(false);
      setCurrentPassword("");
      setNewPassword("");
      setMessage(copy.passwordResetSuccess);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  const cancelForgotPassword = () => {
    setForgotPasswordStep("idle");
    setForgotPasswordCode("");
    setForgotNewPassword("");
    setShowForgotNewPassword(false);
    resetFeedback();
  };

  const savePassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user || !newPassword) return;

    resetFeedback();
    setBusy(true);

    try {
      await user.updatePassword({
        currentPassword: currentPassword || undefined,
        newPassword,
        signOutOfOtherSessions: signOutOthers,
      });

      setCurrentPassword("");
      setNewPassword("");
      setMessage(copy.passwordSaved);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  const inputClass =
    "mt-2 w-full border border-[var(--lpv-line)] bg-transparent px-4 py-3.5 text-[15px] outline-none transition focus:border-[var(--lpv-cocoa)]";

  const primaryButtonClass =
    "inline-flex min-h-11 items-center justify-center bg-[var(--lpv-cocoa)] px-6 py-3 text-sm text-white transition-opacity hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-50";

  const secondaryButtonClass =
    "inline-flex min-h-11 items-center justify-center border border-[var(--lpv-line)] px-6 py-3 text-sm transition hover:border-[var(--lpv-cocoa)]";

  if (!isLoaded || !user) return null;

  return (
    <div className="border-t border-[var(--lpv-line)]">
      <section className="border-b border-[var(--lpv-line)]">
        <button
          type="button"
          onClick={() => togglePanel("identity")}
          className="group flex w-full items-center justify-between gap-8 py-7 text-left md:py-8"
          aria-expanded={panel === "identity"}
        >
          <div>
            <p className="text-base font-medium">{copy.identity}</p>
            <p className="mt-1.5 max-w-xl text-sm leading-6 text-[var(--lpv-muted)]">
              {copy.identityDescription}
            </p>
          </div>

          <span
            aria-hidden="true"
            className={`shrink-0 text-lg transition-transform ${
              panel === "identity" ? "rotate-90" : "group-hover:translate-x-1"
            }`}
          >
            →
          </span>
        </button>

        {panel === "identity" && (
          <form
            onSubmit={saveIdentity}
            className="border-t border-[var(--lpv-line)] pb-8 pt-7 md:pb-10 md:pt-8"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="text-sm">
                {copy.firstName}
                <input
                  type="text"
                  value={firstName}
                  onChange={(event) => setFirstName(event.target.value)}
                  className={inputClass}
                  autoComplete="given-name"
                />
              </label>

              <label className="text-sm">
                {copy.lastName}
                <input
                  type="text"
                  value={lastName}
                  onChange={(event) => setLastName(event.target.value)}
                  className={inputClass}
                  autoComplete="family-name"
                />
              </label>
            </div>

            <Feedback message={message} error={error} />

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={busy}
                className={primaryButtonClass}
              >
                {copy.save}
              </button>

              <button
                type="button"
                onClick={() => setPanel(null)}
                className={secondaryButtonClass}
              >
                {copy.cancel}
              </button>
            </div>
          </form>
        )}
      </section>

      <section className="border-b border-[var(--lpv-line)]">
        <button
          type="button"
          onClick={() => togglePanel("email")}
          className="group flex w-full items-center justify-between gap-8 py-7 text-left md:py-8"
          aria-expanded={panel === "email"}
        >
          <div>
            <p className="text-base font-medium">{copy.email}</p>
            <p className="mt-1.5 max-w-xl text-sm leading-6 text-[var(--lpv-muted)]">
              {copy.emailDescription}
            </p>
          </div>

          <span
            aria-hidden="true"
            className={`shrink-0 text-lg transition-transform ${
              panel === "email" ? "rotate-90" : "group-hover:translate-x-1"
            }`}
          >
            →
          </span>
        </button>

        {panel === "email" && (
          <div className="border-t border-[var(--lpv-line)] pb-8 pt-7 md:pb-10 md:pt-8">
            <div className="mb-6">
              <p className="text-xs uppercase tracking-[0.14em] text-[var(--lpv-muted)]">
                {copy.currentEmail}
              </p>
              <p className="mt-2 text-[15px]">{primaryEmail}</p>
            </div>

            {needsReverification ? (
              <form onSubmit={confirmReverification}>
                <div className="max-w-xl">
                  <p className="text-xs uppercase tracking-[0.14em] text-[var(--lpv-muted)]">
                    {copy.securityCheck}
                  </p>

                  <p className="mt-3 text-sm leading-6">
                    {copy.securityCheckDescription}
                  </p>

                  <p className="mt-2 text-sm leading-6 text-[var(--lpv-muted)]">
                    {copy.securityCodeSent}{" "}
                    <span className="text-[var(--lpv-cocoa)]">
                      {reverificationEmail}
                    </span>
                    .
                  </p>

                  <label className="mt-5 block max-w-xs text-sm">
                    {copy.securityCode}
                    <input
                      type="text"
                      inputMode="numeric"
                      value={reverificationCode}
                      onChange={(event) =>
                        setReverificationCode(event.target.value)
                      }
                      className={inputClass}
                      autoComplete="one-time-code"
                      required
                      autoFocus
                    />
                  </label>
                </div>

                <Feedback message={message} error={error} />

                <div className="mt-6 flex flex-wrap gap-3">
                  <button
                    type="submit"
                    disabled={busy}
                    className={primaryButtonClass}
                  >
                    {copy.confirmIdentity}
                  </button>

                  <button
                    type="button"
                    onClick={cancelReverification}
                    className={secondaryButtonClass}
                  >
                    {copy.cancel}
                  </button>
                </div>
              </form>
            ) : !emailResourceId ? (
              <form onSubmit={sendEmailCode}>
                <label className="block max-w-xl text-sm">
                  {copy.newEmail}
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className={inputClass}
                    autoComplete="email"
                    required
                  />
                </label>

                <Feedback message={message} error={error} />

                <div className="mt-6 flex flex-wrap gap-3">
                  <button
                    type="submit"
                    disabled={busy}
                    className={primaryButtonClass}
                  >
                    {copy.sendCode}
                  </button>

                  <button
                    type="button"
                    onClick={() => setPanel(null)}
                    className={secondaryButtonClass}
                  >
                    {copy.cancel}
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={verifyEmail}>
                <label className="block max-w-xs text-sm">
                  {copy.verificationCode}
                  <input
                    type="text"
                    inputMode="numeric"
                    value={code}
                    onChange={(event) => setCode(event.target.value)}
                    className={inputClass}
                    autoComplete="one-time-code"
                    required
                  />
                </label>

                <Feedback message={message} error={error} />

                <div className="mt-6 flex flex-wrap gap-3">
                  <button
                    type="submit"
                    disabled={busy}
                    className={primaryButtonClass}
                  >
                    {copy.verify}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setEmailResourceId(null);
                      setCode("");
                      resetFeedback();
                    }}
                    className={secondaryButtonClass}
                  >
                    {copy.cancel}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </section>

      <section className="border-b border-[var(--lpv-line)]">
        <button
          type="button"
          onClick={() => togglePanel("password")}
          className="group flex w-full items-center justify-between gap-8 py-7 text-left md:py-8"
          aria-expanded={panel === "password"}
        >
          <div>
            <p className="text-base font-medium">{copy.password}</p>
            <p className="mt-1.5 max-w-xl text-sm leading-6 text-[var(--lpv-muted)]">
              {copy.passwordDescription}
            </p>
          </div>

          <span
            aria-hidden="true"
            className={`shrink-0 text-lg transition-transform ${
              panel === "password" ? "rotate-90" : "group-hover:translate-x-1"
            }`}
          >
            →
          </span>
        </button>

        {panel === "password" && (
          <div className="border-t border-[var(--lpv-line)] pb-8 pt-7 md:pb-10 md:pt-8">
            {forgotPasswordStep === "idle" ? (
              <form onSubmit={savePassword}>
                <div className="grid max-w-xl gap-5">
                  <label className="text-sm">
                    {copy.currentPassword}
                    <div className="relative">
                      <input
                        type={showCurrentPassword ? "text" : "password"}
                        value={currentPassword}
                        onChange={(event) =>
                          setCurrentPassword(event.target.value)
                        }
                        className={`${inputClass} pr-24`}
                        autoComplete="current-password"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowCurrentPassword((value) => !value)
                        }
                        className="absolute right-4 top-1/2 mt-1 -translate-y-1/2 text-xs text-[var(--lpv-muted)] transition hover:text-[var(--lpv-cocoa)]"
                      >
                        {showCurrentPassword
                          ? copy.hidePassword
                          : copy.showPassword}
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={startForgotPassword}
                      disabled={busy || !session}
                      className="mt-2 text-xs text-[var(--lpv-muted)] underline underline-offset-4 transition hover:text-[var(--lpv-cocoa)] disabled:opacity-50"
                    >
                      {copy.forgotPassword}
                    </button>
                  </label>

                  <label className="text-sm">
                    {copy.newPassword}
                    <div className="relative">
                      <input
                        type={showNewPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(event) => setNewPassword(event.target.value)}
                        className={`${inputClass} pr-24`}
                        autoComplete="new-password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowNewPassword((value) => !value)
                        }
                        className="absolute right-4 top-1/2 mt-1 -translate-y-1/2 text-xs text-[var(--lpv-muted)] transition hover:text-[var(--lpv-cocoa)]"
                      >
                        {showNewPassword
                          ? copy.hidePassword
                          : copy.showPassword}
                      </button>
                    </div>
                  </label>

                  <label className="flex cursor-pointer items-start gap-3 text-sm leading-6">
                    <input
                      type="checkbox"
                      checked={signOutOthers}
                      onChange={(event) =>
                        setSignOutOthers(event.target.checked)
                      }
                      className="mt-1"
                    />
                    <span>{copy.signOutOthers}</span>
                  </label>
                </div>

                <Feedback message={message} error={error} />

                <div className="mt-6 flex flex-wrap gap-3">
                  <button
                    type="submit"
                    disabled={busy}
                    className={primaryButtonClass}
                  >
                    {copy.updatePassword}
                  </button>

                  <button
                    type="button"
                    onClick={() => setPanel(null)}
                    className={secondaryButtonClass}
                  >
                    {copy.cancel}
                  </button>
                </div>
              </form>
            ) : forgotPasswordStep === "code" ? (
              <form onSubmit={verifyForgotPasswordCode}>
                <div className="max-w-xl">
                  <p className="text-xs uppercase tracking-[0.14em] text-[var(--lpv-muted)]">
                    {copy.forgotPasswordTitle}
                  </p>

                  <p className="mt-3 text-sm leading-6 text-[var(--lpv-muted)]">
                    {copy.forgotPasswordDescription}
                  </p>

                  <label className="mt-5 block max-w-xs text-sm">
                    {copy.resetCode}
                    <input
                      type="text"
                      inputMode="numeric"
                      value={forgotPasswordCode}
                      onChange={(event) =>
                        setForgotPasswordCode(event.target.value)
                      }
                      className={inputClass}
                      autoComplete="one-time-code"
                      required
                      autoFocus
                    />
                  </label>
                </div>

                <Feedback message={message} error={error} />

                <div className="mt-6 flex flex-wrap gap-3">
                  <button
                    type="submit"
                    disabled={busy || !forgotPasswordCode.trim()}
                    className={primaryButtonClass}
                  >
                    {copy.verifyResetCode}
                  </button>

                  <button
                    type="button"
                    onClick={cancelForgotPassword}
                    className={secondaryButtonClass}
                  >
                    {copy.backToPassword}
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={submitForgotPassword}>
                <div className="grid max-w-xl gap-5">
                  <div>
                    <p className="text-xs uppercase tracking-[0.14em] text-[var(--lpv-muted)]">
                      {copy.chooseNewPassword}
                    </p>

                    <p className="mt-3 text-sm leading-6 text-[var(--lpv-muted)]">
                      {copy.chooseNewPasswordDescription}
                    </p>
                  </div>

                  <label className="text-sm">
                    {copy.newPassword}
                    <div className="relative">
                      <input
                        type={showForgotNewPassword ? "text" : "password"}
                        value={forgotNewPassword}
                        onChange={(event) =>
                          setForgotNewPassword(event.target.value)
                        }
                        className={`${inputClass} pr-24`}
                        autoComplete="new-password"
                        required
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowForgotNewPassword((value) => !value)
                        }
                        className="absolute right-4 top-1/2 mt-1 -translate-y-1/2 text-xs text-[var(--lpv-muted)] transition hover:text-[var(--lpv-cocoa)]"
                      >
                        {showForgotNewPassword
                          ? copy.hidePassword
                          : copy.showPassword}
                      </button>
                    </div>
                  </label>

                  <label className="flex cursor-pointer items-start gap-3 text-sm leading-6">
                    <input
                      type="checkbox"
                      checked={signOutOthers}
                      onChange={(event) =>
                        setSignOutOthers(event.target.checked)
                      }
                      className="mt-1"
                    />
                    <span>{copy.signOutOthers}</span>
                  </label>
                </div>

                <Feedback message={message} error={error} />

                <div className="mt-6 flex flex-wrap gap-3">
                  <button
                    type="submit"
                    disabled={busy || !forgotNewPassword}
                    className={primaryButtonClass}
                  >
                    {copy.resetPassword}
                  </button>

                  <button
                    type="button"
                    onClick={cancelForgotPassword}
                    className={secondaryButtonClass}
                  >
                    {copy.cancel}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </section>
    </div>
  );
}

function Feedback({
  message,
  error,
}: {
  message: string;
  error: string;
}) {
  if (!message && !error) return null;

  return (
    <p
      role="status"
      className={`mt-5 text-sm leading-6 ${
        error ? "text-red-700" : "text-[var(--lpv-cocoa)]"
      }`}
    >
      {error || message}
    </p>
  );
}
