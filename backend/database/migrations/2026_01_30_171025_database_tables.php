<?php

use Illuminate\Support\Facades\DB;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Users table
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('username')->unique();
            $table->string('password');
            $table->string('full_name');
            $table->enum('role', ['admin', 'teacher', 'staff'])->default('staff');
            $table->timestamp('last_login')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });

        // Groups table
        Schema::create('groups', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->text('description')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });

        // Students table
        Schema::create('students', function (Blueprint $table) {
            $table->id();
            $table->string('cef')->unique();
            $table->string('first_name');
            $table->string('last_name');
            $table->string('full_name')->virtualAs("concat(first_name, ' ', last_name)");
            $table->foreignId('group_id')->nullable()->constrained()->nullOnDelete();
            $table->string('level')->nullable();
            $table->string('cin')->nullable();
            $table->string('email')->nullable();
            $table->decimal('hours',11,2)->default(0)->comment('Total absence hours');
            $table->integer('tardies')->default(0)->comment('Total late count');
            $table->decimal('days_absent',11,2)->default(0)->comment('Total days absent');
            $table->integer('justified_absences')->default(0);
            $table->text('observation')->nullable();
            $table->string('class_group')->nullable();
            $table->timestamps();
            $table->softDeletes();
            
            $table->index(['first_name', 'last_name']);
            $table->index('group_id');
        });

        // Absences table
        Schema::create('absences', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained()->onDelete('cascade');
            $table->date('date');
            $table->enum('type', ['hours', 'days', 'session'])->default('session');
            $table->decimal('duration', 5, 2)->default(0)->comment('Hours or days');
            $table->enum('status', ['absent', 'justified', 'late', 'present'])->default('absent');
            $table->text('reason')->nullable();
            $table->enum('session', ['S1', 'S2', 'S3', 'S4'])->nullable();
            $table->integer('day_number')->nullable();
            $table->string('original_session')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            $table->softDeletes();
            
            $table->index(['student_id', 'date']);
            $table->index('date');
            $table->index('status');
        });

        // Settings table
        Schema::create('settings', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->json('value');
            $table->timestamps();
        });

        // Sanction configurations table
        Schema::create('sanction_configs', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->string('label');
            $table->decimal('threshold', 5, 2);
            $table->json('actions')->nullable();
            $table->boolean('is_active')->default(true);
            $table->integer('order')->default(0);
            $table->timestamps();
        });

        // Insert default sanction configs
        DB::table('sanction_configs')->insert([
            ['code' => '1er_mg', 'label' => '1er M.G', 'threshold' => 1, 'actions' => json_encode(['warning']), 'order' => 1, 'created_at' => now(), 'updated_at' => now()],
            ['code' => '2eme_mg', 'label' => '2eme M.G', 'threshold' => 2, 'actions' => json_encode(['warning']), 'order' => 2, 'created_at' => now(), 'updated_at' => now()],
            ['code' => '1er_aver', 'label' => '1er Avertissement', 'threshold' => 3, 'actions' => json_encode(['warning']), 'order' => 3, 'created_at' => now(), 'updated_at' => now()],
            ['code' => '2eme_aver', 'label' => '2eme Avertissement', 'threshold' => 4, 'actions' => json_encode(['warning']), 'order' => 4, 'created_at' => now(), 'updated_at' => now()],
            ['code' => 'blame', 'label' => 'Blâme', 'threshold' => 5, 'actions' => json_encode(['blame']), 'order' => 5, 'created_at' => now(), 'updated_at' => now()],
            ['code' => 'exclu_2jrs', 'label' => 'Exclusion 2 jours', 'threshold' => 6, 'actions' => json_encode(['suspension']), 'order' => 6, 'created_at' => now(), 'updated_at' => now()],
            ['code' => 'exclusion', 'label' => 'Exclusion', 'threshold' => 7, 'actions' => json_encode(['exclusion']), 'order' => 7, 'created_at' => now(), 'updated_at' => now()],
            ['code' => 'urgent', 'label' => 'Urgent', 'threshold' => 10, 'actions' => json_encode(['urgent']), 'order' => 8, 'created_at' => now(), 'updated_at' => now()],
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('sanction_configs');
        Schema::dropIfExists('settings');
        Schema::dropIfExists('absences');
        Schema::dropIfExists('students');
        Schema::dropIfExists('groups');
        Schema::dropIfExists('users');
    }
};