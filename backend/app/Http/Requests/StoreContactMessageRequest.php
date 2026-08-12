<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreContactMessageRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:120'],
            'email' => ['required', 'email:rfc', 'max:190'],
            'phone' => ['nullable', 'string', 'max:30'],
            'company' => ['nullable', 'string', 'max:150'],
            'subject' => ['nullable', 'string', 'max:200'],
            'message' => ['required', 'string', 'min:10', 'max:5000'],
            'enquiry_type' => ['nullable', Rule::in(['hire', 'freelance', 'collaboration', 'other'])],
            'budget_range' => ['nullable', 'string', 'max:60'],
            'timeline' => ['nullable', 'string', 'max:60'],
            // Honeypot: real users never see this field, bots fill it in.
            'website' => ['prohibited'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'message.min' => 'Please add a little more detail so I can reply properly.',
            'website.prohibited' => 'This submission looks automated.',
        ];
    }
}
