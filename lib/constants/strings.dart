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
  static const String summary =
      'Innovative tech mind with 2+ years of experience working as a Flutter Application Development. Capable of working with a variety of technology and software solutions, and managing Api’s,UI Components and 3rd party Sdk’s.Valuable team member who has experience diagnosing problems and developing solutions. Extensive expertise in networking systems and working with mainframe computers.';
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
      'June 2022 ',
      'Present',
      'Software Engineer:Flutter Developer',
      'TxLabz & IT Services and IT Consulting',
    ),
    Education(
      'May 2021',
      'June 2022',
      'GeekLone Technology, Lahore',
      'Flutter developer',
    ),
  ];
}
