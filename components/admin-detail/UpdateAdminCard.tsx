"use client";

import { useState } from "react";
import { adminApi } from "@/api/admins";
import { Admin } from "@/types/admin";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const fieldClass =
  "h-10 border-sky-800/50 bg-white/5 text-sky-50 placeholder:text-sky-200/20";

export function UpdateAdminCard({ admin }: { admin: Admin }) {
  const [firstName, setFirstName] = useState(admin.firstName);
  const [lastName, setLastName] = useState(admin.lastName);
  const [email, setEmail] = useState(admin.email);
  const [country, setCountry] = useState(admin.country ?? "");
  const [phoneNumber, setPhoneNumber] = useState(admin.phoneNumber ?? "");
  const [joiningDate, setJoiningDate] = useState(
    admin.joiningDate?.slice(0, 10) ?? "",
  );
  const [age, setAge] = useState(admin.age?.toString() ?? "");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      await adminApi.update(admin.id, {
        firstName,
        lastName,
        email,
        country,
        phoneNumber: phoneNumber || undefined,
        joiningDate: joiningDate || undefined,
        age: age ? Number(age) : undefined,
      });
      setMessage("Saved changes.");
      setIsError(false);
    } catch {
      setMessage("Save failed. Check the fields and try again.");
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-sky-800/40 bg-sky-950/40 p-6">
      <h3 className="mb-5 text-xs font-semibold tracking-wider text-sky-200/50 uppercase">
        Edit admin
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <Label className="text-xs tracking-wider text-sky-200/50 uppercase">
            First name
          </Label>
          <Input
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className={fieldClass}
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs tracking-wider text-sky-200/50 uppercase">
            Last name
          </Label>
          <Input
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className={fieldClass}
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs tracking-wider text-sky-200/50 uppercase">
            Email
          </Label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={fieldClass}
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs tracking-wider text-sky-200/50 uppercase">
            Country
          </Label>
          <Input
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className={fieldClass}
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs tracking-wider text-sky-200/50 uppercase">
            Phone
          </Label>
          <Input
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className={fieldClass}
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs tracking-wider text-sky-200/50 uppercase">
            Joining date
          </Label>
          <Input
            type="date"
            value={joiningDate}
            onChange={(e) => setJoiningDate(e.target.value)}
            className={fieldClass}
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs tracking-wider text-sky-200/50 uppercase">
            Age
          </Label>
          <Input
            type="number"
            min={18}
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className={fieldClass}
          />
        </div>

        {message && (
          <p className={`text-xs ${isError ? "text-red-400" : "text-emerald-400"}`}>
            {message}
          </p>
        )}

        <Button
          type="submit"
          disabled={loading}
          className="w-full border-0 bg-sky-700 text-white hover:bg-sky-800"
        >
          {loading ? "Saving…" : "Save changes"}
        </Button>
      </form>
    </div>
  );
}
