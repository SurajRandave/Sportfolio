<?php

namespace Database\Seeders;

use App\Models\Experience;
use App\Models\Profile;
use App\Models\Project;
use App\Models\Service;
use App\Models\Skill;
use App\Models\Testimonial;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

/**
 * Seeds the portfolio with Suraj's real CV content so the site is live the
 * moment it boots. Everything here is editable afterwards from /admin.
 */
class PortfolioSeeder extends Seeder
{
    public function run(): void
    {
        $this->admin();
        $this->profile();
        $this->experiences();
        $projects = $this->projects();
        $this->skills();
        $this->services();
        $this->testimonials($projects);
    }

    protected function admin(): void
    {
        User::updateOrCreate(
            ['email' => 'surajrandave3@gmail.com'],
            [
                'name' => 'Suraj Randave',
                'password' => Hash::make(env('ADMIN_PASSWORD', 'Suraj@2026')),
                'email_verified_at' => now(),
            ],
        );
    }

    protected function profile(): void
    {
        Profile::updateOrCreate(
            ['email' => 'surajrandave3@gmail.com'],
            [
                'full_name' => 'Suraj Shivaji Randave',
                'headline' => 'Full-Stack Developer - Laravel, React.js & TypeScript',
                'tagline' => 'I build production SaaS platforms, ERP modules and real-time dashboards.',
                'summary' => 'Full-stack software developer building and maintaining web applications with Laravel, PHP, React.js and TypeScript. '
                    ."I work across the stack - responsive interfaces, backend business logic, database-driven modules and Laravel Blade views - and ship production-ready systems. \n\n"
                    .'Currently an Associate Developer at Inorbvict Healthcare India Pvt. Ltd., where I contribute to SaaS-based ERP/CRM modules covering procurement, warehouse, HRMS, compliance and workflow automation, backed by PostgreSQL and deployed on Azure.',
                'location' => 'Pimpri-Chinchwad, Maharashtra, India',
                'phone' => '+91-7620653019',
                'linkedin_url' => 'https://linkedin.com/in/suraj-randave',
                'github_url' => 'https://github.com/SurajRandave',
                'years_experience' => 2,
                'is_available_for_freelance' => true,
                'availability_note' => 'Open to freelance projects and full-time React/TypeScript or Laravel roles.',
                'meta_title' => 'Suraj Randave - Full-Stack Laravel & React Developer',
                'meta_description' => 'Full-stack developer in Pune specialising in Laravel, React.js, TypeScript and PostgreSQL. SaaS ERP modules, real-time IoT dashboards and client web applications.',
            ],
        );
    }

    protected function experiences(): void
    {
        $rows = [
            [
                'company' => 'Inorbvict Healthcare India Pvt. Ltd.',
                'role' => 'Associate Developer',
                'location' => 'Pune, Maharashtra',
                'start_date' => '2025-10-01',
                'end_date' => null,
                'is_current' => true,
                'sort_order' => 1,
                'description' => 'Building internal SaaS-based ERP/CRM modules for healthcare, procurement, warehouse, HRMS, compliance and business workflow automation.',
                'highlights' => [
                    'Contribute to backend and frontend development using Laravel, PHP, Laravel Blade views, React.js, TypeScript, PostgreSQL and Azure.',
                    'Work across the full Laravel structure - routes, controllers, views, migrations, seeders, models and database relationships.',
                    'Support PostgreSQL operations including table handling, query writing, data validation and application-level data management.',
                    'Build dashboards, form workflows, role-based access functionality and module-level business logic.',
                    'Collaborate with developers, QA and business teams to improve module functionality, UI flow and workflow execution.',
                ],
                'tech_stack' => ['Laravel', 'PHP', 'Blade', 'React.js', 'TypeScript', 'PostgreSQL', 'Azure'],
            ],
            [
                'company' => 'Career Tech IT Solution',
                'role' => 'Software Engineer (Web)',
                'location' => 'Akurdi, Maharashtra',
                'start_date' => '2024-09-01',
                'end_date' => '2025-09-30',
                'is_current' => false,
                'sort_order' => 2,
                'description' => 'Delivered client-facing web applications end to end, from build through deployment and ongoing production support.',
                'highlights' => [
                    'Developed and deployed 5+ client-facing web projects using React.js, PHP, Laravel, Bootstrap and Tailwind.',
                    'Optimised MySQL queries and frontend assets, improving overall site performance by 20%.',
                    'Built responsive, cross-browser compatible UIs from reusable React components.',
                    'Maintained production systems at 99% uptime, resolving bugs and deployment issues.',
                ],
                'tech_stack' => ['React.js', 'PHP', 'Laravel', 'MySQL', 'Bootstrap', 'Tailwind', 'cPanel'],
            ],
        ];

        foreach ($rows as $row) {
            Experience::updateOrCreate(
                ['company' => $row['company'], 'role' => $row['role']],
                $row,
            );
        }
    }

    /**
     * @return array<string, Project>
     */
    protected function projects(): array
    {
        $rows = [
            [
                'title' => 'Parbhani WTP - IoT & PLM Water Management Portal',
                'slug' => 'parbhani-wtp-iot-portal',
                'category' => 'enterprise',
                'role' => 'Full-Stack Developer',
                'client_name' => 'Maharashtra Jeevan Pradhikaran (Municipal Water Department)',
                'summary' => 'A real-time IoT and PLM based government portal that monitors water flow, meter flow and water level from multi-point sensors across a treatment plant.',
                'description' => 'Engineered and extended the Parbhani WTP portal into a full-scale IoT and PLM-based water monitoring platform for the municipal water department. '
                    .'The system ingests live readings from 9-inch multi-point sensors and renders them on a continuously updating operations dashboard.',
                'problem' => 'The water department had no continuous visibility into pump performance or flow rates. Readings were collected manually, so faults surfaced late and decisions were made on stale data.',
                'solution' => 'Integrated live sensor feeds capturing water flow, meter flow and water level, then structured and parsed the raw sensor data strings into a normalised schema. '
                    .'Built a dynamic real-time dashboard rendering pump performance, sensor readings and flow analytics as they arrive.',
                'outcome' => 'Plant operators moved from manual spot checks to continuous monitoring, with faster fault response and genuinely data-driven decisions for the municipal water department.',
                'tech_stack' => ['PHP', 'Laravel', 'JavaScript', 'MySQL', 'REST API', 'IoT Sensors', 'Chart.js'],
                'features' => [
                    'Live ingestion from 9-inch multi-point sensors',
                    'Real-time dashboard for pump performance and flow analytics',
                    'Sensor data string parsing and normalisation',
                    'Water flow, meter flow and water level tracking',
                    'Historical trend reporting for the water department',
                ],
                'live_url' => 'https://parbhani-wtp.mjponline.co.in',
                'is_featured' => true,
                'sort_order' => 1,
                'completed_at' => '2025-08-01',
            ],
            [
                'title' => 'IDIMS Healthcare ERP',
                'slug' => 'idims-healthcare-erp',
                'category' => 'enterprise',
                'role' => 'Associate Developer',
                'client_name' => 'Inorbvict Healthcare India Pvt. Ltd.',
                'summary' => 'An in-house SaaS ERP platform streamlining healthcare operations - procurement, warehouse, HRMS, compliance tracking and internal approval flows.',
                'description' => 'IDIMS is an in-house SaaS-based ERP platform built to streamline healthcare business operations. '
                    .'I contribute to module development across the stack using Laravel, PHP, Blade views, React.js, TypeScript, PostgreSQL and Azure.',
                'problem' => 'Procurement, warehouse, HR and compliance activity lived in disconnected spreadsheets and manual approvals, making status hard to track and audits painful.',
                'solution' => 'Built database-driven modules with role-based access control, dashboards, form workflows and module-level business logic on a normalised PostgreSQL schema.',
                'outcome' => 'Business workflows that previously ran on email and spreadsheets now execute inside one auditable system with clear ownership at every approval step.',
                'tech_stack' => ['Laravel', 'PHP', 'Blade', 'React.js', 'TypeScript', 'PostgreSQL', 'Azure'],
                'features' => [
                    'Procurement and warehouse workflow modules',
                    'HRMS and compliance tracking',
                    'Role-based access control (RBAC)',
                    'Internal approval flows',
                    'Operational dashboards and reporting',
                ],
                'is_featured' => true,
                'sort_order' => 2,
                'completed_at' => '2026-01-01',
            ],
            [
                'title' => 'CoreVista Systems - CRM & Warehouse Management',
                'slug' => 'corevista-systems',
                'category' => 'personal',
                'role' => 'Solo Developer',
                'summary' => 'An enterprise-grade CRM and warehouse management system built in TypeScript, covering customer pipelines and stock movement.',
                'description' => 'A self-directed build exploring enterprise CRM patterns - customer records, sales pipeline stages and warehouse stock movement - in a fully typed TypeScript codebase.',
                'tech_stack' => ['TypeScript', 'React.js', 'Node.js', 'REST API'],
                'features' => [
                    'Customer and lead pipeline management',
                    'Warehouse stock and movement tracking',
                    'Fully typed TypeScript domain models',
                ],
                'repo_url' => 'https://github.com/SurajRandave/corevista-systems',
                'is_featured' => true,
                'sort_order' => 3,
                'completed_at' => '2025-11-22',
            ],
            [
                'title' => 'Event Management Platform',
                'slug' => 'event-management-platform',
                'category' => 'personal',
                'role' => 'Full-Stack Developer',
                'summary' => 'A full-stack event management application with a separate REST backend and React front end for scheduling and registrations.',
                'tech_stack' => ['React.js', 'JavaScript', 'Node.js', 'REST API'],
                'features' => [
                    'Event creation and scheduling',
                    'Attendee registration flow',
                    'Separate API backend and React client',
                ],
                'repo_url' => 'https://github.com/SurajRandave/Event-management-frontend',
                'sort_order' => 4,
                'completed_at' => '2025-02-11',
            ],
            [
                'title' => 'Mobile Store Management System',
                'slug' => 'mobile-store-management-system',
                'category' => 'client',
                'role' => 'Full-Stack Developer',
                'summary' => 'Inventory, billing and sales management for a mobile retail store, built on PHP and MySQL.',
                'tech_stack' => ['PHP', 'MySQL', 'HTML5', 'CSS3', 'JavaScript'],
                'features' => [
                    'Stock and inventory management',
                    'Billing and invoice generation',
                    'Sales reporting',
                ],
                'sort_order' => 5,
                'completed_at' => '2024-06-01',
            ],
        ];

        $saved = [];

        foreach ($rows as $row) {
            $saved[$row['slug']] = Project::updateOrCreate(['slug' => $row['slug']], $row);
        }

        return $saved;
    }

    protected function skills(): void
    {
        $rows = [
            // name, category, proficiency, years
            ['React.js', 'frontend', 88, 2],
            ['TypeScript', 'frontend', 82, 1],
            ['JavaScript', 'frontend', 88, 2.5],
            ['HTML5', 'frontend', 95, 3],
            ['CSS3', 'frontend', 92, 3],
            ['Tailwind CSS', 'frontend', 88, 2],
            ['Bootstrap', 'frontend', 90, 2.5],
            ['Laravel', 'backend', 90, 2],
            ['PHP', 'backend', 90, 2.5],
            ['Laravel Blade', 'backend', 88, 2],
            ['REST API Design', 'backend', 85, 2],
            ['PostgreSQL', 'database', 82, 1],
            ['MySQL', 'database', 88, 2.5],
            ['Database Relationships', 'database', 85, 2],
            ['Microsoft Azure', 'cloud', 70, 1],
            ['Git & GitHub', 'tools', 88, 3],
            ['cPanel', 'tools', 80, 2],
            ['SaaS Module Logic', 'concepts', 82, 1],
            ['RBAC', 'concepts', 85, 1],
            ['Workflow Automation', 'concepts', 80, 1],
            ['Responsive Design', 'concepts', 92, 3],
            ['UI/UX', 'concepts', 78, 2],
        ];

        foreach ($rows as $i => [$name, $category, $proficiency, $years]) {
            Skill::updateOrCreate(
                ['name' => $name],
                [
                    'category' => $category,
                    'proficiency' => $proficiency,
                    'years' => $years,
                    'is_featured' => $proficiency >= 88,
                    'sort_order' => $i,
                ],
            );
        }
    }

    protected function services(): void
    {
        $rows = [
            [
                'title' => 'Laravel Web Application Development',
                'description' => 'Custom Laravel applications built the right way - migrations, models, relationships, request validation and clean controllers. Admin panels, business workflows and database-driven modules.',
                'icon' => 'server',
                'features' => [
                    'Custom Laravel + MySQL/PostgreSQL builds',
                    'Admin dashboards and CRUD modules',
                    'Role-based access control',
                    'REST API development',
                ],
                'starting_price' => 25000,
                'delivery_days' => 21,
                'sort_order' => 1,
            ],
            [
                'title' => 'React & TypeScript Front Ends',
                'description' => 'Responsive, component-driven interfaces in React and TypeScript. Reusable components, typed API layers and cross-browser tested layouts.',
                'icon' => 'code',
                'features' => [
                    'React 19 + TypeScript SPAs',
                    'Tailwind CSS design implementation',
                    'API integration with typed clients',
                    'Mobile-first responsive layouts',
                ],
                'starting_price' => 20000,
                'delivery_days' => 14,
                'sort_order' => 2,
            ],
            [
                'title' => 'Real-Time Dashboards',
                'description' => 'Live operational dashboards for IoT, sales or logistics data - the kind I built for the Parbhani water treatment plant. Websocket driven, no page refresh.',
                'icon' => 'activity',
                'features' => [
                    'Live sensor and telemetry ingestion',
                    'Websocket push via Laravel Reverb',
                    'Charts, KPI tiles and trend analytics',
                    'Historical reporting',
                ],
                'starting_price' => 35000,
                'delivery_days' => 30,
                'sort_order' => 3,
            ],
            [
                'title' => 'Business Websites & Landing Pages',
                'description' => 'Fast, responsive marketing sites and landing pages with a CMS behind them, so you can edit your own content without touching code.',
                'icon' => 'layout',
                'features' => [
                    'Responsive multi-page websites',
                    'Content management back office',
                    'SEO-ready markup and metadata',
                    'Deployment and hosting setup',
                ],
                'starting_price' => 12000,
                'delivery_days' => 10,
                'sort_order' => 4,
            ],
        ];

        foreach ($rows as $row) {
            Service::updateOrCreate(['title' => $row['title']], $row);
        }
    }

    /**
     * @param  array<string, Project>  $projects
     */
    protected function testimonials(array $projects): void
    {
        // Placeholder so the section renders - replace or delete these from /admin
        // once real client feedback comes in.
        Testimonial::updateOrCreate(
            ['client_name' => 'Sample Client'],
            [
                'client_role' => 'Project Manager',
                'company' => 'Replace this from the admin dashboard',
                'message' => 'This is a placeholder testimonial so the section has something to render. Approve, edit or delete it from the admin panel once you collect real client feedback.',
                'rating' => 5,
                'project_id' => $projects['parbhani-wtp-iot-portal']->id ?? null,
                'is_approved' => false,
                'sort_order' => 1,
            ],
        );
    }
}
