/*
  # Add Math Facts, Time, and Money Skills

  1. Changes
    - Adds math fluency skills for grades 1-3
    - Adds time-telling progression from hour to elapsed time
    - Adds money skills from coin identification to word problems

  2. Skills Added
    - Math Facts Fluency (7 skills): Addition, subtraction, multiplication, division
    - Time Progression (5 skills): Hour, half-hour, 5 minutes, minute, elapsed
    - Money Progression (4 skills): Identify coins, count coins, bills/change, word problems

  3. Notes
    - All skills use subject_code 'MATH'
    - Difficulty levels: 1 (basic), 2 (intermediate), 3 (advanced)
    - Display order groups by skill category
    - Designed for automatic fluency practice
*/

INSERT INTO curriculum_skills (subject_code, skill_code, skill_name, description, grade_level, difficulty_level, display_order, is_active) VALUES

-- MATH FACTS FLUENCY
('MATH', 'math_facts_add_10', 'Addition Facts to 10', 'Instant recall: all addition facts within 10', 1, 1, 50, true),
('MATH', 'math_facts_sub_10', 'Subtraction Facts to 10', 'Instant recall: all subtraction facts within 10', 1, 1, 51, true),
('MATH', 'math_facts_add_20', 'Addition Facts to 20', 'Instant recall: all addition facts within 20', 2, 2, 52, true),
('MATH', 'math_facts_sub_20', 'Subtraction Facts to 20', 'Instant recall: all subtraction facts within 20', 2, 2, 53, true),
('MATH', 'math_facts_mult_5', 'Multiplication Facts to 5', 'Instant recall: times tables 1-5', 3, 2, 54, true),
('MATH', 'math_facts_mult_10', 'Multiplication Facts to 10', 'Instant recall: all times tables 1-10', 3, 2, 55, true),
('MATH', 'math_facts_div', 'Division Facts', 'Instant recall: all division facts within 100', 3, 2, 56, true),

-- TIME PROGRESSION
('MATH', 'math_time_hour', 'Time to the Hour', 'Tell and write time to the hour on analog and digital clocks', 1, 1, 60, true),
('MATH', 'math_time_half', 'Time to Half Hour', 'Tell and write time to the half hour', 1, 1, 61, true),
('MATH', 'math_time_5min', 'Time to 5 Minutes', 'Tell time to 5-minute increments with a.m./p.m.', 2, 2, 62, true),
('MATH', 'math_time_minute', 'Time to the Minute', 'Tell time to the nearest minute', 3, 2, 63, true),
('MATH', 'math_time_elapsed', 'Elapsed Time', 'Calculate how much time has passed', 3, 3, 64, true),

-- MONEY PROGRESSION
('MATH', 'math_money_identify', 'Identify Coins', 'Know penny, nickel, dime, quarter by sight and value', 1, 1, 70, true),
('MATH', 'math_money_count_coins', 'Count Coins', 'Count collections of coins to find total value', 2, 2, 71, true),
('MATH', 'math_money_bills', 'Bills and Making Change', 'Work with dollar bills, make change', 2, 2, 72, true),
('MATH', 'math_money_problems', 'Money Word Problems', 'Solve word problems with money using all 4 operations', 3, 2, 73, true);