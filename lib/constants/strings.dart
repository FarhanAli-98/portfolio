// ignore_for_file: constant_identifier_names


import 'package:nomixee/models/education.dart';

class Strings {
  Strings._();

  static const String about_me = 'About Me';
  static const String about = 'About';
  static const String me = ' Me';
  static const String oladayo = 'Nomix';
  static const String emmanuel = 'ee';
  static const String headline =
      'I am Farhan Ali, Mobile App Developer from Lahore, Pakistan';
  static final String summary =
      'Focused professional having excellent technical and communication skills, and offering ${DateTime.now().year - DateTime(2020, 06, 1).year} years of experience in Computer industry. Proficient at designing and formulating test automation frameworks, writing code in various languages, feature development and implementation. Specialize in thinking outside the box to find unique solutions to difficult engineering problems.';
  static const String experience = 'Experience';
  static const String skills_i_have = 'My Stack';
  static final String rights_reserved =
      '© ${DateTime.now().year} Nomixee. ALL RIGHTS RESERVED.';

  // menu items
  static const String menu_home = 'Home';
  static const String menu_about = 'About';
  static const String menu_contact = 'Contact Me';

  static const skills = [
    'Dart',
    'Flutter',
    'Java',
    'Android',
    'iOS',
    'Firebase',
    'Reactive Programming',
    'Python',
    'Javascript',
    'Node.js',
    'C++',
    'TypeScript',
    'Express'
  ];

  // Education Methods:---------------------------------------------------------
  static var workingExperienceList = [
    Education(
      'June 2020',
      'Sep 2020',
      'Mobile Application Development Services (MADS) (Remote).',
      'Flutter Internship',
    ),
    Education(
      'April 2021',
      'August 2022',
      'Bitpiler Limited',
      'Mobile App Developer (Contract)',
    ),
    Education(
      'Oct 2021',
      'Jan 2022',
      'Livepetal Systems',
      'Mobile App Developer',
    ),
    Education(
      'Jan 2020',
      'Present',
      'Foresight Ridge Limited',
      'Chief Technology Officer and Co - Founder',
    ),
  ];
}
